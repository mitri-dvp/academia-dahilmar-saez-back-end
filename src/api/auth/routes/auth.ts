module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/signup",
      handler: "auth.signup",
    },
    {
      method: "POST",
      path: "/auth/login",
      handler: "auth.login",
    },
  ],
};
