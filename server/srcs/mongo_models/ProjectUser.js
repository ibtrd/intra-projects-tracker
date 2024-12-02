const mongoose = require("mongoose");

const ProjectUserSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    final_mark: { type: Number, default: null },
    validated: { type: Boolean, default: false },
});

ProjectUserSchema.statics.syncIntra = async function(project, user, intra) {
    return this.findOneAndUpdate(
        { id: intra.id },
        {
            project: project,
            user: user,
            final_mark: intra.final_mark,
            validated: intra.validated,
        },
        { upsert: true, new: true } 
    )
}

const ProjectUser = mongoose.model("ProjectUser", ProjectUserSchema);

module.exports = ProjectUser;
