module.exports = {
  routes: [
    {
      method: "POST",
      path: "/schedules",
      handler: "schedule.create",
    },
  ],
};
