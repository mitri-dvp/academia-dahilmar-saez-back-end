import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";

module.exports = {
  async get(ctx) {
    return "WIP";
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
            users: true,
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
};
