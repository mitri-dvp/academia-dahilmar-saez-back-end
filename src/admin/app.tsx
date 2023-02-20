// path: ./my-app/src/admin/app.ts

import logo from "./extensions/logo.png";
import favicon from "./extensions/favicon.ico";

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: logo,
    },
    // Replace the favicon
    head: {
      favicon: favicon,
    },
    // Replace the Strapi logo in the main navigation
    menu: {
      logo: logo,
    },
    // Override or extend the theme
    theme: {
      // overwrite light theme properties
      light: {
        colors: {
          alternative100: "#f6ecfc",
          alternative200: "#e0c1f4",
          alternative500: "#ac73e6",
          alternative600: "#9736e8",
          alternative700: "#8312d1",
          buttonNeutral0: "#ffffff",
          buttonPrimary500: "#7b79ff",
          buttonPrimary600: "#4945ff",
          danger100: "#fcecea",
          danger200: "#f5c0b8",
          danger500: "#ee5e52",
          danger600: "#d02b20",
          danger700: "#b72b1a",
          neutral0: "#ffffff",
          neutral100: "#f6f6f9",
          neutral1000: "#181826",
          neutral150: "#eaeaef",
          neutral200: "#dcdce4",
          neutral300: "#c0c0cf",
          neutral400: "#a5a5ba",
          neutral500: "#8e8ea9",
          neutral600: "#666687",
          neutral700: "#4a4a6a",
          neutral800: "#32324d",
          neutral900: "#212134",
          primary100: "#f0f0ff",
          primary200: "#d9d8ff",
          primary500: "#7b79ff",
          primary600: "#4945ff",
          primary700: "#271fe0",
          secondary100: "#eaf5ff",
          secondary200: "#b8e1ff",
          secondary500: "#66b7f1",
          secondary600: "#0c75af",
          secondary700: "#006096",
          success100: "#eafbe7",
          success200: "#c6f0c2",
          success500: "#5cb176",
          success600: "#328048",
          success700: "#2f6846",
          warning100: "#fdf4dc",
          warning200: "#fae7b9",
          warning500: "#f29d41",
          warning600: "#d9822f",
          warning700: "#be5d01",
        },
      },

      // overwrite dark theme properties
      dark: {
        colors: {
          alternative100: "#181826",
          alternative200: "#4a4a6a",
          alternative500: "#ac73e6",
          alternative600: "#ac73e6",
          alternative700: "#e0c1f4",
          buttonNeutral0: "#ffffff",
          buttonPrimary500: "#7b79ff",
          buttonPrimary600: "#4945ff",
          danger100: "#181826",
          danger200: "#4a4a6a",
          danger500: "#ee5e52",
          danger600: "#ee5e52",
          danger700: "#ee5e52",
          neutral0: "#212134",
          neutral100: "#181826",
          neutral1000: "#ffffff",
          neutral150: "#32324d",
          neutral200: "#4a4a6a",
          neutral300: "#666687",
          neutral400: "#a5a5ba",
          neutral500: "#c0c0cf",
          neutral600: "#a5a5ba",
          neutral700: "#eaeaef",
          neutral800: "#ffffff",
          neutral900: "#ffffff",
          primary100: "#181826",
          primary200: "#4a4a6a",
          primary500: "#4945ff",
          primary600: "#7b79ff",
          primary700: "#7b79ff",
          secondary100: "#181826",
          secondary200: "#4a4a6a",
          secondary500: "#66b7f1",
          secondary600: "#66b7f1",
          secondary700: "#b8e1ff",
          success100: "#181826",
          success200: "#4a4a6a",
          success500: "#5cb176",
          success600: "#5cb176",
          success700: "#c6f0c2",
          warning100: "#181826",
          warning200: "#4a4a6a",
          warning500: "#f29d41",
          warning600: "#f29d41",
          warning700: "#fae7b9",
        },
      },
      locales: ["es"],
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { release: false },
  },

  bootstrap() {},
};
