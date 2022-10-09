const asyncHandler = require("express-async-handler");
const Chat = require("../models/chats");
const User = require("../models/users");

//Create or fetch private chat (POST /api/v1/chat/)
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("User ID Missing");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  //private chat
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //create chat
    var chatData = {
      chatName: "sender", //just any string data
      isGroupChat: false,
      users: [req.user._id, userId], //both users
    };

    try {
      const createdChat = await Chat.create(chatData);
      //console.log(createdChat, 'created and stored newChat')

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//Get all chats (GET /api/v1/chat/)
const getChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        //populating user inside latestMessage's sender
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//Create New GP(POST /api/v1/chat/group/create)
const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  //stringified users array sent from FE //parsed here
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user); //loggedIn user by default added to the group as an admin

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroup: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Rename Group (PUT /api/chat/group/rename)
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// Remove user from Group (PUT /api/chat/group/remove)
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the request is sent from admin on FE

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  //console.log(removed);

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

//Add user to Group / Leave(PUT /api/chat/groupadd)
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  //check if the requester is admin on FE

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  //console.log(added);

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

module.exports = {
  accessChat,
  getChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
