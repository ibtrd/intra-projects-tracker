const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  tracking: { type: Boolean, default: false },
});

ProjectSchema.methods.track = async function () {
  if (this.tracking) {
    return this;
  }
  this.tracking = true;
  return await this.save();
};

ProjectSchema.methods.untrack = async function () {
  if (!this.tracking) {
    return this;
  }
  this.tracking = false;
  return await this.save();
};

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
