module.exports = {
  routes: [
    {
      method: "GET",
      path: "/notifications",
      handler: "notification.get",
    },
    {
      method: "PUT",
      path: "/notifications/:notificationID",
      handler: "notification.update",
    },
    {
      method: "DELETE",
      path: "/notifications/:notificationID",
      handler: "notification.deleteNotification",
    },
  ],
};
