const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Preset",
    required: true,
  },
}, {
  timestamps: true
});

favoriteSchema.index({ user: 1, preset: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);