const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  exam: { type: Boolean, default: false },
  tracking: { type: Boolean, default: true },
  blacklist: { type: Boolean, default: false },
});

ProjectSchema.methods.track = async function () {
  if (this.tracking) {
    return true;
  }
  this.tracking = true;
  this.save();
  return false;
};

ProjectSchema.methods.untrack = async function () {
  if (!this.tracking) {
    return true;
  }
  this.tracking = false;
  this.save();
  return false;
};

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
