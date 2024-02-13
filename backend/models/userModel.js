const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "add first name"],
    },
    email: {
      type: String,
      required: [true, "add email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "add password"],
    },
    role: {
      type: String,
      default: "simple",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
