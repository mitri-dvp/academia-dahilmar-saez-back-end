module.exports = {
  routes: [
    {
      method: "GET",
      path: "/events",
      handler: "event.get",
    },
    {
      method: "POST",
      path: "/events",
      handler: "event.create",
    },
  ],
};
