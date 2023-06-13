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

    await strapi.query("api::event.event").create({
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
};
