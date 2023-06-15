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
        },
      },
    });

    return { group: group };
  },
  async getAttendances(ctx) {
    const user = ctx.state.user;
    const { groupID, date } = ctx.params;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    const group = await strapi.query("api::group.group").findOne({
      where: {
        id: groupID,
        attendances: {
          $and: [
            { datetime: { $lt: dayjs(date).endOf("day").toDate() } },
            { datetime: { $gt: dayjs(date).startOf("day").toDate() } },
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
            { datetime: { $lt: dayjs(date).endOf("day").toDate() } },
            { datetime: { $gt: dayjs(date).startOf("day").toDate() } },
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
};
