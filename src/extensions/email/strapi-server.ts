import { ContactEmail } from "../../templates/contact";
import { TrainerPendingEmail } from "../../templates/trainerPending";
import { TrainerConfirmationEmail } from "../../templates/trainerConfirmation";

import { render } from "@react-email/render";

module.exports = (plugin) => {
  plugin.controllers.email.send = async (ctx) => {
    const { template } = ctx.request.body as EmailBody;

    if (ctx.state.user === undefined) {
      switch (template) {
        case "contact":
          return await sendContactEmail(ctx);
        case "trainerPending":
          return await sendTrainerPendingEmail(ctx);
        case "trainerConfirmation":
          return await sendTrainerConfirmationEmail(ctx);
        default:
          return ctx.badRequest("Template not found");
      }
    }

    return ctx.throw(400, "Bad Request");
  };

  return plugin;
};

async function sendContactEmail(ctx) {
  // Guest --> Admin
  const body = ctx.request.body as EmailBody;
  const data = body.data as ContactData;

  if (!data.name || !data.email || !data.phone || !data.message) {
    return ctx.badRequest("Missing data");
  }

  try {
    await strapi
      .plugin("email")
      .service("email")
      .send({
        to: "mitri.dvp@gmail.com",
        from: "Academia Dahilmar Sáez <mitri.dvp@gmail.com>",
        replyTo: null,
        subject: `Mensaje de ${data.name}`,
        text: `${data.name}, ${data.email}, ${data.phone}, ${data.message}.`,
        html: render(ContactEmail(data)),
      });
  } catch (error) {
    console.log(error);
    return ctx.internalServerError("EMAIL :: ERROR");
  }

  return ctx.send("EMAIL :: SUCCESS");
}

async function sendTrainerPendingEmail(ctx) {
  // Trainer --> Admin
  const data = ctx.request.body.data as User;

  try {
    await strapi
      .plugin("email")
      .service("email")
      .send({
        to: "mitri.dvp@gmail.com",
        from: "Academia Dahilmar Sáez <mitri.dvp@gmail.com>",
        replyTo: null,
        subject: `Aprobación de Cuenta Entrenador para ${data.firstName} ${data.lastName}`,
        text: `${data.firstName} ${data.lastName} inició el proceso de registro para una cuenta Entrenador`,
        html: render(TrainerPendingEmail(data)),
      });
  } catch (error) {
    console.log(error);
    return ctx.internalServerError("EMAIL :: ERROR");
  }

  return ctx.send("EMAIL :: SUCCESS");
}

async function sendTrainerConfirmationEmail(ctx) {
  // Admin --> Trainer
  const data = ctx.request.body.data as User;

  try {
    await strapi
      .plugin("email")
      .service("email")
      .send({
        to: "mitri.dvp@gmail.com",
        from: "Academia Dahilmar Sáez <mitri.dvp@gmail.com>",
        replyTo: null,
        subject: `Cuenta Entrenador Aprobada para ${data.firstName} ${data.lastName}`,
        text: `${data.firstName} ${data.lastName} su cuenta de Entrenador ha sido Aprobada`,
        html: render(TrainerConfirmationEmail(data)),
      });
  } catch (error) {
    console.log(error);
    return ctx.internalServerError("EMAIL :: ERROR");
  }

  return ctx.send("EMAIL :: SUCCESS");
}
