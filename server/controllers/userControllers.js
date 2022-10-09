const asyncHandler = require("express-async-handler");
const User = require("../models/users");
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

  //* Validation: Filling All Fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please make sure all fields are filled");
  }

  //* Validation: Correct Email
  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email." });
  }

  const userExists = await User.findOne({ email });

  //* Validation: Unique Email
  if (userExists) {
    res.status(400);
    throw new Error("The email address already exists.");
  }

  //* Validation: Password Strength
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters, which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character (!@#$%^&*).",
    });
  }

  //* Make temp username and check for uniqueness
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
    });
  } else {
    res.status(400);
    throw new Error("Oops, something went wrong");
  }
});

// Login the user (POST /api/v1/user/login)
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.checkPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("The email address or password is incorrect");
  }
});

// Get or Search all users (GET /api/v1/user?search=)
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

module.exports = { registerUser, authUser, allUsers };
