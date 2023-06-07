import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";

type CreateBody = {
  data: {
    contact: User;
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
        chats: {
          populate: {
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
            messages: {
              populate: {
                user: {
                  select: ["id"],
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
      chats: user.chats,
    });
  },

  async create(ctx) {
    const user = ctx.state.user;
    const {
      data: { contact },
    } = ctx.request.body as CreateBody;

    // TO-DO Validate if chat already exists (Chat(user.id,contact.id).exists())

    const chat = await strapi.query("api::chat.chat").create({
      data: {
        users: [user.id, contact.id],
      },
      populate: {
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

    return { chat: chat };
  },
};
