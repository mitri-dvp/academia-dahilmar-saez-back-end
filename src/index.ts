import { Strapi } from "@strapi/strapi";
import { Server } from "socket.io";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }: { strapi: Strapi }) {
    // ...
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    strapi.io = new Server(strapi.server.httpServer, {
      cors: {
        origin: process.env.HOST || "http://localhost:5000",
        methods: ["GET", "POST"],
      },
    });
  },
};
