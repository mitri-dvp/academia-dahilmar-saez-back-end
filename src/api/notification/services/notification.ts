/**
 * notification service
 */

import { factories } from "@strapi/strapi";
import { USER_ROLES } from "../../../utils/global";

export default factories.createCoreService(
  "api::notification.notification",
  ({ strapi }) => ({
    notify: async ({
      read,
      actor,
      notifiers,
      message,
      entity,
      entityID,
      action,
    }) => {
      let notifiersList: number[] = [];

      switch (notifiers) {
        case USER_ROLES.ATHLETE:
          notifiersList = await findIDS(actor, USER_ROLES.ATHLETE);
          break;
        case USER_ROLES.GUARDIAN:
          notifiersList = await findIDS(actor, USER_ROLES.GUARDIAN);
          break;
        case USER_ROLES.TRAINER:
          notifiersList = await findIDS(actor, USER_ROLES.TRAINER);
          break;
        case "all":
          notifiersList = await findIDS(actor);
        default:
          break;
      }

      const promises = notifiersList.map((notifier) =>
        strapi
          .query("api::notification.notification")
          .create({
            data: {
              read: read,
              actor: actor,
              notifier: notifier,
              message: message,
              entity: entity,
              entityID: entityID,
              action: action,
            },
          })
          .then((notification) =>
            strapi.io.emit(`NOTIFICATION::${notifier}`, notification)
          )
      );

      await Promise.all(promises);
    },
  })
);

const findIDS = async (
  actorID: number,
  roleType?: string
): Promise<number[]> => {
  const conditions: any = [
    {
      id: {
        $ne: actorID,
      },
    },
  ];

  if (roleType) {
    conditions.push({
      role: {
        type: roleType,
      },
    });
  }

  const users: User[] = await strapi
    .query("plugin::users-permissions.user")
    .findMany({
      where: {
        $and: conditions,
      },
      select: ["id"],
    });

  return users.map((user) => user.id);
};
