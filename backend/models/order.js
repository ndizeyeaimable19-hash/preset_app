// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  presets: [
    {
      preset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Preset",
        required: true,
      },
      name: String,
      price: Number,
      qty: { type: Number, default: 1 },
    }
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "paid",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);