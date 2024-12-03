const mongoose = require("mongoose");

const ActiveTeamSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    grade: { type: Number, required: true },
    terminating_at: { type: Date, required: true },
    closed_at: { type: Date, default: null },
});

const ActiveTeam = mongoose.model("ActiveTeam", ActiveTeamSchema);

module.exports = ActiveTeam;
