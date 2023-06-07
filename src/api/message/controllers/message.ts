import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";

module.exports = {
  async get(ctx) {
    const { email } = ctx.state.user;

    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        email: email,
      },
      populate: {
        messages: {
          populate: {},
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
};
