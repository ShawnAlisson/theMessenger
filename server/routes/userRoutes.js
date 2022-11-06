const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateProfile,
  updateDetails,
  updatePassword,
  getProfile,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/register").post(registerUser);
router.post("/login", authUser);
router.route("/update").post(protect, updateProfile);
router.put("/updatedetails", protect, updateDetails);
router.post("/updatePassword", protect, updatePassword);
router.post("/getprofile", protect, getProfile);

module.exports = router;
