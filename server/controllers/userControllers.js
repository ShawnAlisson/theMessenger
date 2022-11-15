const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const Code = require("../models/code");
const { sendVerificationEmail, sendResetCode } = require("../helpers/email");
const generateCode = require("../helpers/generateCode");
const { generateToken } = require("../helpers/tokens");
const {
  validateEmail,
  validateLength,
  validatePassword,
  validateUsername,
} = require("../helpers/validation");

//* Register new user (POST /api/v1/user/)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation: Filling All Fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please make sure all fields are filled");
  }

  // Validation: Correct Email
  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email." });
  }

  const userExists = await User.findOne({ email });

  // Validation: Unique Email
  if (userExists) {
    res.status(400);
    throw new Error("The email address already exists.");
  }

  // Validation: Password Strength
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters, which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character (!@#$%^&*).",
    });
  }

  // Make temp username and check for uniqueness
  let tempUsername = name.replace(/ /g, "");
  let newUsername = await validateUsername(tempUsername);

  const user = await User.create({
    name,
    email,
    password,
    username: newUsername,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error("Oops, something went wrong");
  }
});

//* Login the user (POST /api/v1/user/login)
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const profile = await User.findOne({ email }).select("-password");

  if (user && (await user.checkPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      details: user.details,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("The email address or password is incorrect");
  }
});

//* Send Reset Password Code
const sendResetPasswordCode = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedCode = await new Code({
      code,
      user: user._id,
    }).save();
    sendResetCode(user.email, user.name, code);
    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* Validate Reset Password Code
const validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong.",
      });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Reset Password
const changePassword = async (req, res) => {
  const { email, password } = req.body;

  // Validation: Password Strength
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters, which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character (!@#$%^&*).",
    });
  }

  const cryptedPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    {
      password: cryptedPassword,
    }
  );
  return res.status(200).json({ message: "ok" });
};

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId).select("-password");
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      details: user.details,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Oops, something went wrong");
  }
});

//* Update Password
const updatePassword = asyncHandler(async (req, res) => {
  const { password, currentPassword } = req.body;

  if (!password || !currentPassword) {
    res.status(400);
    throw new Error("Please make sure all fields are filled");
  }

  // Validation: Password Strength
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters, which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character (!@#$%^&*).",
    });
  }

  const salt = await bcrypt.genSalt(12);
  encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.findById(req.body.userId);

  const isSamePassword = await bcrypt.compare(password, user.password);

  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: "The new password cannot be the same as the current password",
    });
  }

  const isCurrentPassword = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPassword) {
    return res.status(400).json({
      success: false,
      message: "Current Password is Incorrect!",
    });
  }

  await User.findByIdAndUpdate(
    req.body.userId,

    {
      password: encryptedPassword,
    }
  );
  return res.status(200).json({ message: "ok" });
});

//* Update Profile Details
const updateDetails = async (req, res) => {
  try {
    const { infos } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.body.userId,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Update existing profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, username } = req.body;

  // Validation: Correct Email
  if (email) {
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email." });
    }
  }

  const userExists = await User.findOne({ email });

  // Validation: Unique Email
  if (userExists) {
    res.status(400);
    throw new Error("The email address already exists.");
  }

  const usernameExists = await User.findOne({ username });

  // Validation: Unique Email
  if (username) {
    if (usernameExists) {
      res.status(400);
      throw new Error("The username already exists.");
    }
  }

  const user = await User.findByIdAndUpdate(
    req.body.userId,
    {
      name,
      email,
      username,
    },
    {
      new: true,
    }
  );

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      details: user.details,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Oops, something went wrong");
  }
});

//* Get or Search all users (GET /api/v1/user?search=)
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, //case insensitive
          { username: { $regex: req.query.search, $options: "i" } },
          // { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // All users (self exclude)
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  updateProfile,
  updateDetails,
  updatePassword,
  sendResetPasswordCode,
  validateResetCode,
  changePassword,
  getProfile,
};
