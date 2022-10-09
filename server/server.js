const app = require("./app");
const dotenv = require("dotenv").config();
const http = require("http");
const io = require("socket.io");
const connectDB = require("./helpers/db");
const colors = require("colors");

connectDB();
const httpServer = http.createServer(app);
const socketServer = io(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8000;

socketServer.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("joinchat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stoptyping", (room) => socket.in(room).emit("stoptyping"));

  socket.on("newmessage", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.users) return console.log("not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;

      socket.in(user._id).emit("messagerecieved", newMessage);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold);
});
