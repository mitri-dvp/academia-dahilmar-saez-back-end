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
    {
      method: "GET",
      path: "/group/:groupID/attendances/:date",
      handler: "group.getAttendances",
    },
    {
      method: "POST",
      path: "/group/:groupID/attendances/:date",
      handler: "group.postAttendances",
    },
  ],
};
