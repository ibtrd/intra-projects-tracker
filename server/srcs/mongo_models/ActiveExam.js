const mongoose = require("mongoose");

const ActiveExamSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  grade: { type: Number, required: true },
  closed_at: { type: Date, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 12 * 60 * 60, // Document expires after 12 hours
  },
});

const ActiveExam = mongoose.model("ActiveExam", ActiveExamSchema);

module.exports = ActiveExam;
