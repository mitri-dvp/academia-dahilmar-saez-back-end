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
    {
      method: "PUT",
      path: "/events/:eventID",
      handler: "event.update",
    },
    {
      method: "DELETE",
      path: "/events/:eventID",
      handler: "event.deleteEvent",
    },
  ],
};
