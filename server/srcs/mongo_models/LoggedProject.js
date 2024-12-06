const mongoose = require("mongoose");

const LoggedProjectSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  grade: { type: Number, required: true },
  validated: { type: Boolean },
  closed_at: { type: Date, default: null },
});

const LoggedProject = mongoose.model("LoggedProject", LoggedProjectSchema);

module.exports = LoggedProject;
