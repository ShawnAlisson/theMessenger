const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      text: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    avatar: {
      type: String,
      trim: true,
      default: "../assets/images/default_avatar.png",
    },
    cover: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    birth_year: {
      type: Number,
      //   required: [true, "Birth Year is required!"],
      trim: true,
    },
    birth_month: {
      type: Number,
      //   required: [true, "Birth Year is required!"],
      trim: true,
    },
    birth_day: {
      type: Number,
      //   required: [true, "Birth Year is required!"],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    requests: {
      type: Array,
      default: [],
    },
    search: [
      {
        user: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    details: {
      bio: {
        type: String,
      },
      location: {
        type: String,
      },
      title: {
        type: String,
      },
      website: {
        type: String,
      },
      status: {
        type: String,
      },
      relationship: {
        type: String,
        enum: [
          "Single",
          "In a realationship",
          "Complicated",
          "Married",
          "Separated",
          "in an open relationship",
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
