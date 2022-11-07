const asyncHandler = require("express-async-handler");
const Message = require("../models/messages");
const User = require("../models/users");
const Chat = require("../models/chats");

//Get all Messages (GET /api/v1/Message/:chatId)
const allMessages = asyncHandler(async (req, res) => {
  try {
    //:chatId in routes //request params
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Seen Message (POST /api/v1/Message/seen)
const seenMessage = asyncHandler(async (req, res) => {
  const { seen, messageId } = req.body;

  if (!seen || !messageId) {
    console.log("Invalid data");
    return res.sendStatus(400);
  }
  var seenMessage = {
    messageId: messageId,
    seen: seen,
  };
  try {
    await Message.findByIdAndUpdate(req.body.messageId, { seen: seen });
    res.json("ok");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//Create New Message (POST /api/v1/Message/)
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data");
    return res.sendStatus(400);
  }
  //schema
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    //populating the instance
    message = await message.populate("sender", "name");
    message = await message.populate("chat");

    //populating with the user in that chat field of our message doc instance
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage, seenMessage };
