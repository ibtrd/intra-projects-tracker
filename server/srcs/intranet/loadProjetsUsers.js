const ActiveTeam = require("../mongo_models/ActiveTeam");
const Project = require("../mongo_models/Project");
const ProjectUser = require("../mongo_models/ProjectUser");
const User = require("../mongo_models/User");
const { api42 } = require("./api42")

module.exports.loadProjectUsers = async function () {
    console.log("Scraping!");
    const projects = await Project.find({ tracking: true });
    for (const project of projects) {
        await loadProject(project);
    }
}

async function loadProject(project) {
    console.log(`Loading: ${project.name} (${project.id})`);
    const options = {
        campus: 9,
    }
    const query = await api42.getProjectProjectUsers(project.id, options);
    for (const entry of query) {
        const user = await User.getById(entry.user);
        entry.team = entry.teams[entry.teams.length - 1];
        let activeTeam = ActiveTeam.findOne({ id: entry.team });
        if (activeTeam) {
            if (entry.team.terminating_at > new Date()) { 
                console.log(`${user.login}'s ${project.name} ended`);
                await activeTeam.delete();
            } else if (entry.team.final_mark > activeTeam.grade) {
                activeTeam.grade = entry.team.final_mark;
                await activeTeam.save();
                console.log(`${user.login} - ${project.name} - ${activeTeam.grade}`)
            }
        } else if (entry.team.terminating_at) {
            activeTeam = await ActiveTeam.create({
                id: team.id,
                user: user,
                project: project,
                grade: entry.team.final_mark,
                terminating_at: entry.team.terminating_at,
            })
            console.log(`${user.login} started ${project.name}!`);
        }
        const projectUser = await ProjectUser.syncIntra(project, user, entry);
    }
    console.log(`Success!`)
}


