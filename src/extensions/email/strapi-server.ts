import { render } from "@react-email/render";
import { ContactEmail } from "../../templates/contact";

module.exports = (plugin) => {
  plugin.controllers.email.send = async (ctx) => {
    const { template } = ctx.request.body as EmailBody;

    if (ctx.state.user === undefined) {
      switch (template) {
        case "contact":
          return await sendContactEmail(ctx);
        default:
          return ctx.badRequest("Template not found");
      }
    }

    return ctx.throw(400, "Bad Request");
  };

  return plugin;
};

async function sendContactEmail(ctx) {
  // Guest --> RentBarker
  const body = ctx.request.body as EmailBody;
  const data = body.data as ContactData;

  if (!data.name || !data.email || !data.message) {
    return ctx.badRequest("Missing data");
  }

  return ctx.send("EMAIL :: SUCCESS :: FAKE");

  try {
    await strapi
      .plugin("email")
      .service("email")
      .send({
        to: "mitri.dvp@gmail.com",
        from: "Academia Dahilmar Sáez <mitri.dvp@gmail.com>",
        replyTo: null,
        subject: `Mensaje de ${data.name}`,
        text: `${data.name}, ${data.email}, ${data.message}.`,
        html: render(ContactEmail(data)),
      });
  } catch (e) {
    console.log(e);
    return ctx.internalServerError("EMAIL :: ERROR");
  }

  return ctx.send("EMAIL :: SUCCESS");
}
