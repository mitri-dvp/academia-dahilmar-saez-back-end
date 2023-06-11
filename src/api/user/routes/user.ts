module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/users/edit",
      handler: "user.edit",
    },
    {
      method: "POST",
      path: "/users/photo/upload",
      handler: "user.photoUpload",
    },
    {
      method: "DELETE",
      path: "/users/photo/upload",
      handler: "user.photoDelete",
    },
    {
      method: "GET",
      path: "/users/athletes",
      handler: "user.getAthletes",
    },
  ],
};
