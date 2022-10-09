const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/register").post(registerUser);
router.post("/login", authUser);

module.exports = router;
