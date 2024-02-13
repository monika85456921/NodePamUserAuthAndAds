const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "add text"],
    },
    description: {
      type: String,
      required: [true, "add description"],
    },
    price: {
      type: Number,
      required: [true, "add price"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);
