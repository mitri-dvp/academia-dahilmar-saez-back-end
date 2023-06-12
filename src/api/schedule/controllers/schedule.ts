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
};
