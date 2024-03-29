import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { USER_ROLES } from "../../../utils/global";
import { decrypt } from "../../../utils/encryption";

type EditBody = {
  data: {
    firstName: string;
    lastName: string;
    documentID: string;
    dateOfBirth: string;
    email: string;
    phone: string;
  };
};

type PhotoUploadBody = {
  replaceID?: string;
};

module.exports = {
  async edit(ctx) {
    const { data } = ctx.request.body as EditBody;
    const { id, email } = ctx.state.user;

    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        email: email,
      },
      populate: {
        role: true,
        photo: true,
      },
    });

    if (!user) {
      return ctx.badRequest("Usuario no encontrado");
    }

    const userEdit = await strapi
      .service("plugin::users-permissions.user")
      .edit(id, {
        username: data.email,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        documentID: data.documentID,
        dateOfBirth: data.dateOfBirth,
      });

    return ctx.send({
      user: {
        id: user.id,
        username: userEdit.userEditname,
        email: userEdit.email,
        phone: userEdit.phone,
        firstName: userEdit.firstName,
        lastName: userEdit.lastName,
        documentID: userEdit.documentID,
        dateOfBirth: userEdit.dateOfBirth,
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
  async photoUpload(ctx) {
    const { id } = ctx.state.user;
    const { replaceID } = ctx.request.body as PhotoUploadBody;
    const { photo } = ctx.request.files;

    let newPhoto = null;

    if (replaceID) {
      // Replace
      const replacedPhoto = await strapi.plugins.upload.services.upload.replace(
        replaceID,
        {
          data: {
            ref: "plugin::users-permissions.user",
            refId: id,
            field: "photo",
          },
          file: photo,
        }
      );

      newPhoto = replacedPhoto;
    }

    if (!replaceID) {
      // Upload
      const uploadedPhoto = await strapi.plugins.upload.services.upload.upload({
        files: photo,
        data: {
          ref: "plugin::users-permissions.user",
          refId: id,
          field: "photo",
        },
      });

      newPhoto = uploadedPhoto[0];
    }

    if (newPhoto) {
      return ctx.send({
        photo: {
          id: newPhoto.id,
          name: newPhoto.name,
          url: newPhoto.url,
          createdAt: newPhoto.createdAt,
          updatedAt: newPhoto.updatedAt,
        },
      });
    }

    return "OK";
  },
  async photoDelete(ctx) {
    const { id, email } = ctx.state.user;

    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        email: email,
      },
      populate: {
        role: true,
        photo: true,
      },
    });

    if (!user) {
      return ctx.badRequest("Usuario no encontrado");
    }

    const file = await strapi.plugins["upload"].services.upload.findOne(
      user.photo.id
    );

    await strapi.plugins["upload"].services.upload.remove(file);

    return ctx.send({
      photo: null,
    });
  },
  async getAthletes(ctx) {
    const user = ctx.state.user;

    const verifyUser = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          email: user.email,
        },
      });

    if (!verifyUser) {
      return ctx.badRequest("Usuario no encontrado");
    }

    if (user.role.type !== USER_ROLES.TRAINER) {
      return ctx.badRequest("Rol de usuario no autorizado");
    }

    const athletes = await strapi
      .query("plugin::users-permissions.user")
      .findMany({
        where: {
          role: {
            type: USER_ROLES.ATHLETE,
          },
        },
        select: [
          "id",
          "firstName",
          "lastName",
          "documentID",
          "dateOfBirth",
          "username",
          "email",
          "phone",
          "provider",
          "createdAt",
          "updatedAt",
        ],
        populate: {
          role: true,
          photo: {
            select: ["id", "name", "url", "createdAt", "updatedAt"],
          },
        },
        orderBy: [{ lastName: "ASC" }],
      });

    return ctx.send({ athletes: athletes });
  },
  async getUserFromToken(ctx) {
    const { token } = ctx.query;

    const data = decrypt(token);

    const parts = data.split("::");

    const id = parts.shift();
    const email = parts.shift();

    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        id: id,
        email: email,
      },
      select: [
        "id",
        "firstName",
        "lastName",
        "documentID",
        "dateOfBirth",
        "username",
        "email",
        "phone",
        "provider",
        "createdAt",
        "updatedAt",
      ],
      populate: {
        role: true,
        photo: {
          select: ["id", "name", "url", "createdAt", "updatedAt"],
        },
      },
    });

    if (!user) {
      return ctx.badRequest("Usuario no encontrado");
    }

    return ctx.send({ user: user });
  },
  async confirmUser(ctx) {
    const { token } = ctx.query;

    const data = decrypt(token);

    const parts = data.split("::");

    const id = parts.shift();
    const email = parts.shift();

    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        id: id,
        email: email,
      },
      select: [
        "id",
        "firstName",
        "lastName",
        "documentID",
        "dateOfBirth",
        "username",
        "email",
        "phone",
        "provider",
        "createdAt",
        "updatedAt",
      ],
      populate: {
        role: true,
        photo: {
          select: ["id", "name", "url", "createdAt", "updatedAt"],
        },
      },
    });

    if (!user) {
      return ctx.badRequest("Usuario no encontrado");
    }

    await strapi.service("plugin::users-permissions.user").edit(id, {
      confirmed: true,
    });

    ctx.request.body = {
      ...ctx.request.body,
      template: "trainerConfirmation",
      data: {
        ...user,
      },
    };

    strapi.plugin("email").controller("email").send(ctx);

    return ctx.send({
      user: {
        ...user,
        confirmed: true,
      },
    });
  },
};
