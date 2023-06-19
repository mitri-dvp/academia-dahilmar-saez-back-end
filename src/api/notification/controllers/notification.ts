import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";

type NotificationData = {
  data: {
    read: boolean;
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
        notificationsRecieved: true,
      },
      select: ["id"],
    });

    if (!user) {
      return ctx.badRequest("Usuario no encontrado");
    }

    return ctx.send({
      notifications: user.notificationsRecieved,
    });
  },
  async update(ctx) {
    const user = ctx.state.user;
    const { notificationID } = ctx.params;

    const { data } = ctx.request.body as NotificationData;

    const verifyNotification = await strapi
      .query("api::notification.notification")
      .findOne({
        where: {
          $and: [
            {
              id: notificationID,
            },
            {
              notifier: {
                id: user.id,
              },
            },
          ],
        },
        select: ["id"],
      });

    if (!verifyNotification) {
      return ctx.badRequest("Notificacion no encontrada");
    }

    await strapi.query("api::notification.notification").update({
      where: { id: notificationID },
      data: {
        read: data.read,
      },
    });

    const userVerify = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          email: user.email,
        },
        populate: {
          notificationsRecieved: true,
        },
        select: ["id"],
      });

    if (!userVerify) {
      return ctx.badRequest("Usuario no encontrado");
    }

    return ctx.send({
      notifications: userVerify.notificationsRecieved,
    });
  },
  async deleteNotification(ctx) {
    const user = ctx.state.user;
    const { notificationID } = ctx.params;

    const verifyNotification = await strapi
      .query("api::notification.notification")
      .findOne({
        where: {
          $and: [
            {
              id: notificationID,
            },
            {
              notifier: {
                id: user.id,
              },
            },
          ],
        },
        select: ["id"],
      });

    if (!verifyNotification) {
      return ctx.badRequest("Notificacion no encontrada");
    }

    await strapi.query("api::notification.notification").delete({
      where: { id: notificationID },
    });

    const userVerify = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          email: user.email,
        },
        populate: {
          notificationsRecieved: true,
        },
        select: ["id"],
      });

    if (!userVerify) {
      return ctx.badRequest("Usuario no encontrado");
    }

    return ctx.send({
      notifications: userVerify.notificationsRecieved,
    });
  },
};
