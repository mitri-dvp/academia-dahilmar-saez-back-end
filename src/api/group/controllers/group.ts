import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { USER_ROLES } from "../../../utils/global";
import dayjs from "dayjs";

type DraftAttendance = {
  id: number | null;
  status: boolean;
  remarks: string;
  userID: number;
};

type CreateBody = {
  data: {
    groupData: {
      name: string;
      description: string;
      users: number[];
    };
  };
};

type PostAttendancesBody = {
  data: {
    draftAttendances: DraftAttendance[];
  };
};

module.exports = {
  async get(ctx) {
    const { email } = ctx.state.user;

    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        email: email,
      },
      populate: {
        groups: {
          populate: {
            class: true,
            schedules: true,
            users: {
              select: [
                "id",
                "firstName",
                "lastName",
                "documentID",
                "dateOfBirth",
                "username",
                "email",
                "phone",
                "provider",
                "createdAt",
                "updatedAt",
              ],
              populate: {
                role: true,
                photo: {
                  select: ["id", "name", "url", "createdAt", "updatedAt"],
                },
              },
              orderBy: [{ lastName: "ASC" }],
            },
          },
        },
      },
      select: ["id"],
    });

    if (!user) {
      return ctx.badRequest("Usuario no encontrado");
    }

    return ctx.send({
      groups: user.groups,
    });
  },
  async create(ctx) {
    const user = ctx.state.user;

    const {
      data: { groupData },
    } = ctx.request.body as CreateBody;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    // TODO Verify Group
    // const verifyGroup = await strapi.query("api::chat.chat").findOne({
    //   where: {
    //     $and: [
    //       {
    //         users: {
    //           id: user.id,
    //         },
    //       },
    //       {
    //         users: {
    //           id: contact.id,
    //         },
    //       },
    //     ],
    //   },
    //   select: ["id"],
    // });

    // if (verifyGroup) {
    //   return ctx.badRequest("Grupo ya existe encontrado");
    // }

    const group = await strapi.query("api::group.group").create({
      data: {
        ...groupData,
      },
      populate: {
        class: true,
        schedules: true,
        users: {
          select: [
            "id",
            "firstName",
            "lastName",
            "documentID",
            "dateOfBirth",
            "username",
            "email",
            "phone",
            "provider",
            "createdAt",
            "updatedAt",
          ],
          populate: {
            role: true,
            photo: {
              select: ["id", "name", "url", "createdAt", "updatedAt"],
            },
          },
          orderBy: [{ lastName: "ASC" }],
        },
      },
    });

    return { group: group };
  },
  async update(ctx) {
    const user = ctx.state.user;
    const { groupID } = ctx.params;

    const {
      data: { groupData },
    } = ctx.request.body as CreateBody;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    const group = await strapi.query("api::group.group").update({
      where: { id: groupID },
      data: {
        ...groupData,
      },
      populate: {
        class: true,
        schedules: true,
        users: {
          select: [
            "id",
            "firstName",
            "lastName",
            "documentID",
            "dateOfBirth",
            "username",
            "email",
            "phone",
            "provider",
            "createdAt",
            "updatedAt",
          ],
          populate: {
            role: true,
            photo: {
              select: ["id", "name", "url", "createdAt", "updatedAt"],
            },
          },
          orderBy: [{ lastName: "ASC" }],
        },
      },
    });

    return { group: group };
  },
  async deleteGroup(ctx) {
    const user = ctx.state.user;
    const { groupID } = ctx.params;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    await strapi.query("api::group.group").delete({
      where: { id: groupID },
      populate: {
        group: {
          select: ["id"],
        },
      },
    });

    const userVerify = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          email: user.email,
        },
        populate: {
          groups: {
            populate: {
              class: true,
              schedules: true,
              users: {
                select: [
                  "id",
                  "firstName",
                  "lastName",
                  "documentID",
                  "dateOfBirth",
                  "username",
                  "email",
                  "phone",
                  "provider",
                  "createdAt",
                  "updatedAt",
                ],
                populate: {
                  role: true,
                  photo: {
                    select: ["id", "name", "url", "createdAt", "updatedAt"],
                  },
                },
                orderBy: [{ lastName: "ASC" }],
              },
            },
          },
        },
        select: ["id"],
      });

    if (!userVerify) {
      return ctx.badRequest("Usuario no encontrado");
    }

    return ctx.send({
      groups: userVerify.groups,
    });
  },
  async getAttendances(ctx) {
    const user = ctx.state.user;
    const { groupID, date } = ctx.params;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    const attendances = await strapi
      .query("api::attendance.attendance")
      .findMany({
        where: {
          $and: [
            { datetime: { $lte: dayjs(date).endOf("day").toDate() } },
            { datetime: { $gte: dayjs(date).startOf("day").toDate() } },
          ],
          group: {
            id: groupID,
          },
        },
        populate: {
          user: {
            select: ["id", "firstName", "lastName"],
            orderBy: [{ lastName: "ASC" }],
          },
        },
      });

    return ctx.send({
      attendances: attendances,
    });
  },
  async postAttendances(ctx) {
    const user = ctx.state.user;
    const { groupID, date } = ctx.params;
    const {
      data: { draftAttendances },
    } = ctx.request.body as PostAttendancesBody;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    for (let i = 0; i < draftAttendances.length; i++) {
      const attendance = draftAttendances[i];

      if (attendance.id) {
        // Update Attendance
        await strapi.query("api::attendance.attendance").update({
          where: { id: attendance.id },
          data: {
            status: attendance.status,
            remarks: attendance.remarks,
          },
        });
      }
      if (!attendance.id) {
        // Update Attendance
        await strapi.query("api::attendance.attendance").create({
          data: {
            status: attendance.status,
            remarks: attendance.remarks,
            datetime: dayjs(date).toDate(),
            group: groupID,
            user: attendance.userID,
          },
        });
      }
    }

    const group = await strapi.query("api::group.group").findOne({
      where: {
        id: groupID,
        attendances: {
          $and: [
            { datetime: { $lte: dayjs(date).endOf("day").toDate() } },
            { datetime: { $gte: dayjs(date).startOf("day").toDate() } },
          ],
        },
      },
      populate: {
        attendances: {
          populate: {
            user: {
              select: ["id"],
            },
          },
        },
      },
      select: ["id"],
    });

    if (group) {
      return ctx.send({
        attendances: group.attendances,
      });
    }

    return ctx.send({
      attendances: [],
    });
  },
  async exportAttendances(ctx) {
    const user = ctx.state.user;
    const { groupID } = ctx.params;
    const { date, range } = ctx.query;

    const startDate = dayjs(date).startOf(range);
    const endDate = dayjs(date).endOf(range);

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    const attendances = await strapi
      .query("api::attendance.attendance")
      .findMany({
        where: {
          $and: [
            { datetime: { $lte: endDate.toDate() } },
            { datetime: { $gte: startDate.toDate() } },
          ],
          group: {
            id: groupID,
          },
        },
        populate: {
          user: {
            select: ["id", "firstName", "lastName"],
            orderBy: [{ lastName: "ASC" }],
          },
        },
      });

    return ctx.send({
      attendances: attendances.sort(
        (a, b) => dayjs(a.datetime).unix() - dayjs(b.datetime).unix()
      ),
    });
  },
};
