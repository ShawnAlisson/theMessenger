const express = require("express");
const {
  accessChat,
  getChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, getChats);
router.route("/group/create").post(protect, createGroup);
router.route("/group/rename").put(protect, renameGroup);
router.route("/group/remove").put(protect, removeFromGroup);
router.route("/group/add").put(protect, addToGroup);

module.exports = router;
