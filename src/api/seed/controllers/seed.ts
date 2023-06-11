import { USER_ROLES } from "../../../utils/global";

const names = [
  "Valero Aquino",
  "Sancha Robles",
  "Cebrián Aguilar",
  "Héctor Abarca",
  "Adolfo Prieto",
  "Pablo Rubio",
  "Nerea Quijada",
  "Asunción Bosque",
  "Yurena Arias",
  "Ramona Arreola",
  "Pánfilo Varela",
  "Dina Villa",
  "Jesús Iglesias",
  "Cristián Villa",
  "Gerardo Paz",
  "Plácida Ramos",
  "Selena Espino",
  "Filomena Salvador",
  "Venceslás Santana",
  "Isabela Márquez",
  "Aurelia Navarro",
  "Geraldo Fonseca",
  "Raúl Hernández",
  "Ignacia Hernández",
  "Olaya Juárez",
  "Valerio Antúnez",
  "Yamilé Quirós",
  "Salvador Quesada",
  "Asun Castro",
  "Claudina Belmonte",
  "Nereo Torres",
  "María Teresa Espinosa",
  "Sonsoles Fontana",
  "Abrahán Arroyo",
  "Josepe Pinto",
  "Dominga Asturias",
  "Lorenzo Figueroa",
  "Amaranta Flores",
  "Jordana Paz",
  "Avelino Antúnez",
  "Flavio Arreola",
  "Florentino Santiago",
  "Marimar Cuesta",
  "Aníbal Domingo",
  "Javiera Soto",
  "Iridián Jorge",
  "Áurea Duarte",
  "Camilo Esteban",
  "Inés Castilla",
  "Ylenia Sancho",
];

module.exports = {
  async athlete(ctx) {
    const role = await strapi.query("plugin::users-permissions.role").findOne({
      select: ["id"],
      where: {
        type: USER_ROLES.ATHLETE,
      },
    });

    if (!role) {
      return ctx.badRequest("invalid role");
    }

    const roleID = role.id;

    await strapi.entityService.deleteMany("plugin::users-permissions.user", {
      filters: {
        email: {
          $containsi: "@seed.com",
        },
      },
    });

    for (let i = 0; i < names.length; i++) {
      const name = names[i];

      const [firstName, lastName] = name.split(" ");
      const lowerCaseFirstName = firstName.toLowerCase();

      await strapi.entityService.create("plugin::users-permissions.user", {
        data: {
          username: lowerCaseFirstName,
          email: lowerCaseFirstName + "@seed.com",
          password: "password",
          confirmed: true,
          role: roleID,
          firstName: firstName,
          lastName: lastName,
          documentID: String(Math.floor(Math.random() * 1000000) + 1 + (i + 1)),
          dateOfBirth: "2000-01-01",
          provider: "local",
        },
      });
    }

    return "SEED::ATHLETE::SUCCESS";
  },
};
