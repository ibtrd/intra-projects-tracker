const mongoose = require("mongoose");

const ProjectUserSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    final_mark: { type: Number, default: null },
    validated: { type: Boolean, default: false },
    current_team: {
        grade: { type: Number, default: 0 },
    }
});

const ProjectUser = mongoose.model("ProjectUser", ProjectUserSchema);

module.exports = ProjectUser;
