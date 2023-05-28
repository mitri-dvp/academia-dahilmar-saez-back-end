import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";

type SingupBody = {
  data: {
    firstName: string;
    lastName: string;
    documentID: number;
    dateOfBirth: string;
    email: string;
    password: string;
    role: string;
  };
};

type LoginBody = {
  data: {
    email: string;
    password: string;
  };
};

module.exports = {
  async signup(ctx) {
    const { data } = ctx.request.body as SingupBody;

    const role = await strapi.query("plugin::users-permissions.role").findOne({
      select: ["id"],
      where: {
        type: data.role,
      },
    });

    if (!role) {
      return ctx.badRequest("invalid role");
    }

    const roleID = role.id;

    const user = await strapi.entityService.create(
      "plugin::users-permissions.user",
      {
        data: {
          username: data.email,
          email: data.email,
          password: data.password,
          confirmed: true,
          role: roleID,
          firstName: data.firstName,
          lastName: data.lastName,
          documentID: data.documentID,
          dateOfBirth: data.dateOfBirth,
          provider: "local",
        },
        populate: {
          role: true,
          photo: true,
        },
      }
    );

    const jwt = await strapi
      .service("plugin::users-permissions.jwt")
      .issue({ id: user.id });

    return ctx.send({
      token: jwt,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        documentID: user.documentID,
        dateOfBirth: user.dateOfBirth,
        provider: user.provider,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          id: user.role.id,
          type: user.role.type,
          createdAt: user.role.createdAt,
          updatedAt: user.role.updatedAt,
        },
        photo: user.photo
          ? {
              id: user.photo.id,
              name: user.photo.name,
              url: user.photo.url,
              createdAt: user.photo.createdAt,
              updatedAt: user.photo.updatedAt,
            }
          : null,
      },
    });
  },
  async login(ctx) {
    const { data } = ctx.request.body as LoginBody;

    // Check if the user exists.
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        email: data.email,
      },
      populate: {
        role: true,
        photo: true,
      },
    });

    if (!user) {
      return ctx.badRequest("Email o contraseña inválidos");
    }

    if (!user.password) {
      return ctx.badRequest("Email o contraseña inválidos");
    }

    const validPassword = await strapi
      .service("plugin::users-permissions.user")
      .validatePassword(data.password, user.password);

    if (!validPassword) {
      return ctx.badRequest("Email o contraseña inválidos");
    }

    const jwt = await strapi
      .service("plugin::users-permissions.jwt")
      .issue({ id: user.id });

    return ctx.send({
      token: jwt,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        documentID: user.documentID,
        dateOfBirth: user.dateOfBirth,
        provider: user.provider,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          id: user.role.id,
          type: user.role.type,
          createdAt: user.role.createdAt,
          updatedAt: user.role.updatedAt,
        },
        photo: user.photo
          ? {
              id: user.photo.id,
              name: user.photo.name,
              url: user.photo.url,
              createdAt: user.photo.createdAt,
              updatedAt: user.photo.updatedAt,
            }
          : null,
      },
    });
  },
};
