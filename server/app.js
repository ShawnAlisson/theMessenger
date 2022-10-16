const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const path = require("path");
const SubscriptionModel = require("./models/subscriptionSchema");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dotenv = require("dotenv").config();

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

//* Redirect HTTP to HTTPS in Production
function isSecure(req) {
  if (req.headers["x-forwarded-proto"]) {
    return req.headers["x-forwarded-proto"] === "https";
  }
  return req.secure;
}
app.use((req, res, next) => {
  if (process.env.NODE_ENV == "production" && !isSecure(req)) {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

app.use(cors());
app.use(express.json());

// TODO: WEB PUSH NOTIFICATION
// app.use(express.urlencoded({ extended: false }));
// app.post("/api/v1/subscribe", async (req, res, next) => {
//   const newSubscription = await SubscriptionModel.create({ ...req.body });
//   const options = {
//     vapidDetails: {
//       subject: "mailto:myemail@example.com",
//       publicKey: process.env.PUBLIC_KEY,
//       privateKey: process.env.PRIVATE_KEY,
//     },
//   };
//   try {
//     const res2 = await webPush.sendNotification(
//       newSubscription,
//       JSON.stringify({
//         title: "Hello from server",
//         description: "this message is coming from the server",
//         image:
//           "https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg",
//       }),
//       options
//     );
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

//* Deployment
const __dirname1 = path.resolve();

//* Set React Build Folder as Static in Production
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

module.exports = app;
