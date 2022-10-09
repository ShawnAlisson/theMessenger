const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dotenv = require("dotenv").config();

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

//* Deployment
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Server is running...");
  });
}

app.use(notFound);
app.use(errorHandler);
// app.get("/", (req, res) => {
//   res.send("Server is running...");
// });

module.exports = app;
