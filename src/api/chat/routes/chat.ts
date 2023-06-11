module.exports = {
  routes: [
    {
      method: "GET",
      path: "/chats",
      handler: "chat.get",
    },
    {
      method: "POST",
      path: "/chats",
      handler: "chat.create",
    },
    {
      method: "GET",
      path: "/chats/:chatID/messages",
      handler: "chat.getMessages",
    },
    {
      method: "POST",
      path: "/chats/:chatID/messages",
      handler: "chat.sendMessage",
    },
  ],
};
