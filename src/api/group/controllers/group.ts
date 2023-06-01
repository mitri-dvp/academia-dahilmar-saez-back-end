import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";

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
};
