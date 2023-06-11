import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";

type CreateBody = {
  data: {
    contact: User;
  };
};

type SendMessageBody = {
  data: {
    text: string;
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

    const validateChat = await strapi.query("api::chat.chat").findOne({
      where: {
        $and: [
          {
            users: {
              id: user.id,
            },
          },
          {
            users: {
              id: contact.id,
            },
          },
        ],
      },
      select: ["id"],
    });

    if (validateChat) {
      return ctx.badRequest("Chat ya existe encontrado");
    }

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

  async getMessages(ctx) {
    const { chatID } = ctx.params;
    const { user } = ctx.state;

    const chat = await strapi.query("api::chat.chat").findOne({
      where: {
        id: chatID,
        users: user.id,
      },
      populate: {
        messages: {
          populate: {
            user: {
              select: ["id"],
            },
          },
        },
      },
      select: ["id"],
    });

    if (!chat) {
      return ctx.badRequest("Chat no encontrado");
    }

    return { messages: chat.messages };
  },

  async sendMessage(ctx) {
    const { chatID } = ctx.params;
    const { user } = ctx.state;
    const {
      data: { text },
    } = ctx.request.body as SendMessageBody;

    const chat = await strapi.query("api::chat.chat").findOne({
      where: {
        id: chatID,
        users: user.id,
      },
      select: ["id"],
    });

    if (!chat) {
      return ctx.badRequest("Chat no encontrado");
    }

    const message = await strapi.query("api::message.message").create({
      data: {
        message: text,
        chat: chat.id,
        user: user.id,
      },
    });

    const updatedChat = await strapi.query("api::chat.chat").findOne({
      where: {
        id: chatID,
        users: user.id,
      },
      populate: {
        messages: {
          populate: {
            user: {
              select: ["id"],
            },
          },
        },
      },
      select: ["id"],
    });

    // Socket Emit
    strapi.io.emit(`CHAT::${chat.id}::MESSAGES`, updatedChat.messages);

    return `SOCKET::EMIT::CHAT::${chat.id}::MESSAGES::OK`;
  },
};
