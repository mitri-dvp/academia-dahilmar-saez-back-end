import { USER_ROLES } from "../../../utils/global";

type CreateBody = {
  data: {
    scheduleData: {
      datetime: Date;
      groupID: number;
    };
  };
};

module.exports = {
  async create(ctx) {
    const user = ctx.state.user;

    const {
      data: { scheduleData },
    } = ctx.request.body as CreateBody;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    await strapi.query("api::schedule.schedule").create({
      data: {
        datetime: scheduleData.datetime,
        group: scheduleData.groupID,
      },
    });

    const group = await strapi.query("api::group.group").findOne({
      where: {
        id: scheduleData.groupID,
      },
      populate: {
        schedules: true,
      },
    });

    return { schedules: group.schedules };
  },
  async update(ctx) {
    const user = ctx.state.user;
    const { scheduleID } = ctx.params;

    const {
      data: { scheduleData },
    } = ctx.request.body as CreateBody;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    await strapi.query("api::schedule.schedule").update({
      where: { id: scheduleID },
      data: {
        datetime: scheduleData.datetime,
      },
    });

    const group = await strapi.query("api::group.group").findOne({
      where: {
        id: scheduleData.groupID,
      },
      populate: {
        schedules: true,
      },
    });

    return { schedules: group.schedules };
  },
  async deleteSchedule(ctx) {
    const user = ctx.state.user;
    const { scheduleID } = ctx.params;

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    const schedule = await strapi.query("api::schedule.schedule").findOne({
      where: { id: scheduleID },
      populate: {
        group: {
          select: ["id"],
        },
      },
    });

    if (!schedule) {
      return ctx.badRequest("Horario no encontrado");
    }

    await strapi.query("api::schedule.schedule").delete({
      where: { id: schedule.id },
    });

    const group = await strapi.query("api::group.group").findOne({
      where: {
        id: schedule.group.id,
      },
      populate: {
        schedules: true,
      },
    });

    return { schedules: group.schedules };
  },
};
