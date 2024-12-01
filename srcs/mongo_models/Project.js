const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    tracking: { type: Boolean, default: true }
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
