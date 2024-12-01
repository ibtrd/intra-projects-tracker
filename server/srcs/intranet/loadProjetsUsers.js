const ProjectUser = require("../mongo_models/ProjectUser");
const User = require("../mongo_models/User");
const { api42 } = require("./api42")

module.exports.loadProjectUsers = async function (project) {
    const options = {
        campus: 9
    }
    const query = await api42.getProjectProjectUsers(project.id, options);
    for (const entry of query) {
        let user = await User.findOne({ id: entry.user.id });
        if (!user) {
           user = await User.create({
                id: entry.user.id,
                login: entry.user.login,
            }) 
        }
        await ProjectUser.findOneAndUpdate(
            { id: entry.id },
            { project, user, final_mark: entry.final_mark, validated: entry.validated },
            { upsert: true, new: true }
        )
    }
    console.log("scan done!");
}