module.exports = {
  routes: [
    {
      method: "GET",
      path: "/groups",
      handler: "group.get",
    },
    {
      method: "POST",
      path: "/groups",
      handler: "group.create",
    },
  ],
};
