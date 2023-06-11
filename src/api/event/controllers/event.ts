import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";

module.exports = {
  async get(ctx) {
    const events = await strapi.query("api::event.event").findMany();

    return ctx.send({
      events: events,
    });
  },
};
