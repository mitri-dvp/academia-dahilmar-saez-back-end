module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/user/edit",
      handler: "user.edit",
    },
    {
      method: "POST",
      path: "/user/photo/upload",
      handler: "user.photoUpload",
    },
    {
      method: "DELETE",
      path: "/user/photo/upload",
      handler: "user.photoDelete",
    },
  ],
};
