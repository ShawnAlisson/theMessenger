const app = require("./app");
const dotenv = require("dotenv").config();
// const webPush = require("web-push");
const http = require("http");
const https = require("https");
const fs = require(`fs`);
const io = require("socket.io");
const connectDB = require("./helpers/db");
const colors = require("colors");

const CERT_DIR = process.env.CERT_DIR;
const KEY_DIR = process.env.KEY_DIR;

// const options = {
//   key: fs.readFileSync(`${KEY_DIR}`),
//   cert: fs.readFileSync(`${CERT_DIR}`),
// };

connectDB();

const httpServer = http.createServer(app);

// const httpsServer = https.createServer(options, app);

const socketServer = io(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8080;
const PORT_HTTP = process.env.PORT_HTTP || 8000;

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
  socket.on("seen", (room) => socket.in(room).emit("seen"));

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

//* ENABLE HTTPS ON PRODUCTION
if (process.env.NODE_ENV == "production") {
  httpsServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.green.bold);
  });
}

httpServer.listen(PORT_HTTP, () => {
  console.log(`Server is running on port ${PORT_HTTP}`.green.bold);
});
