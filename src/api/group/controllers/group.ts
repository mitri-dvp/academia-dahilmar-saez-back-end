import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { USER_ROLES } from "../../../utils/global";

type CreateBody = {
  data: {
    groupData: {
      name: string;
      description: string;
      users: number[];
    };
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
};
