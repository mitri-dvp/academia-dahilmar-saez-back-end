import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { USER_ROLES } from "../../../utils/global";

type CreateBody = {
  data: {
    event: {
      name: string;
      description: string;
      datetime: Date;
    };
  };
};

module.exports = {
  async get(ctx) {
    const events = await strapi.query("api::event.event").findMany();

    return ctx.send({
      events: events,
    });
  },
  async create(ctx) {
    const user = ctx.state.user;

    const {
      data: { event },
    } = ctx.request.body as CreateBody;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    const newEvent = await strapi.query("api::event.event").create({
      data: {
        name: event.name,
        description: event.description,
        datetime: event.datetime,
      },
      select: ["id"],
    });

    // Notify
    strapi.service("api::notification.notification").notify({
      read: false,
      actor: user.id,
      notifiers: USER_ROLES.ATHLETE,
      message: `Nuevo evento "${event.name}"`,
      entity: "api::event.event",
      entityID: newEvent.id,
      action: "create",
    });

    const events = await strapi.query("api::event.event").findMany();

    return ctx.send({
      events: events,
    });
  },
  async update(ctx) {
    const user = ctx.state.user;
    const { eventID } = ctx.params;

    const {
      data: { event },
    } = ctx.request.body as CreateBody;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    await strapi.query("api::event.event").update({
      where: { id: eventID },
      data: {
        name: event.name,
        description: event.description,
        datetime: event.datetime,
      },
    });

    const events = await strapi.query("api::event.event").findMany();

    return ctx.send({
      events: events,
    });
  },
  async deleteEvent(ctx) {
    const user = ctx.state.user;
    const { eventID } = ctx.params;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    await strapi.query("api::event.event").delete({
      where: { id: eventID },
    });

    const events = await strapi.query("api::event.event").findMany();

    return ctx.send({
      events: events,
    });
  },
};
