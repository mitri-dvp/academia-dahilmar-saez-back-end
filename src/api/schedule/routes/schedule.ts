module.exports = {
  routes: [
    {
      method: "POST",
      path: "/schedules",
      handler: "schedule.create",
    },
    {
      method: "PUT",
      path: "/schedules/:scheduleID",
      handler: "schedule.update",
    },
    {
      method: "DELETE",
      path: "/schedules/:scheduleID",
      handler: "schedule.deleteSchedule",
    },
  ],
};
