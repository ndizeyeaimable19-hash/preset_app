// models/Preset.js
const mongoose = require("mongoose");

const presetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  image: { type: String, default: null },
  presetFile: { type: String, default: null },
  fileType: { type: String, default: null },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    ratings: [{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
}],
  }],
}, { timestamps: true });

// Virtuals for ratings
presetSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
  return parseFloat((sum / this.ratings.length).toFixed(1));
});

presetSchema.virtual('ratingCount').get(function() {
  return this.ratings.length;
});

presetSchema.set('toJSON', { virtuals: true });
presetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Preset", presetSchema);