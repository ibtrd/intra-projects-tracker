const ActiveTeam = require("../mongo_models/ActiveTeam");
const Project = require("../mongo_models/Project");
const ProjectUser = require("../mongo_models/ProjectUser");
const User = require("../mongo_models/User");
const { wsClients } = require("../router/router");
const { wsBroadcast, wsAddtoPayload } = require("../websocket/websocket");
const { api42 } = require("./api42");
const { teamStart } = require("./teamStart");

let lastUpdate = new Date(0);

module.exports.loadProjectUsers = async function () {
    const projects = await Project.find({ tracking: true });
    const options = {
        filter: { campus: 9 },
        range: { updated_at: [
            lastUpdate.toISOString(),
            '2042-01-01T00:00:00.000Z'
        ]}
    }
    for (const project of projects) {
        await loadProject(project, options);
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - 5);
    lastUpdate = now;
}

async function loadProject(project, options) {
    console.log(`Loading: ${project.name} (${project.id})`);
    const query = await api42.getProjectProjectUsers(project.id, options);
    for (const entry of query) {
        if (entry.user['staff?'] || !entry.user['active?']) {
            // console.warn(`ignored user: ${entry.user.login}`);
            continue ;
        }
        const user = await User.getById(entry.user);
        entry.team = entry.teams[entry.teams.length - 1];
        let activeTeam = await ActiveTeam.findOne({ id: entry.team.id });
        if (activeTeam) {
            console.log(entry.team);
            if (new Date() < entry.team.terminating_at) {
                console.log(`${user.login}'s ${project.name} expired`);
                await activeTeam.delete();
            } else if (entry.team.final_mark > activeTeam.grade) {
                activeTeam.grade = entry.team.final_mark;
                await activeTeam.save();
                wsAddtoPayload(project.id, 'update', {
                    login: user.login,
                    grade: entry.team.final_mark
                })
                console.log(`${user.login} - ${project.name} - ${activeTeam.grade}`)
            } else if (entry.team.closed_at) {
                console.log(`${user.login} finished ${project.name}`);
                wsAddtoPayload(project.id, 'end', {
                    login: user.login,
                    grade: entry.team.final_mark
                })
            }
        } else if (entry.team.terminating_at) {
            await teamStart(entry.team, project, user);
        }
        const projectUser = await ProjectUser.syncIntra(project, user, entry);
    }
    console.log(`processed ${query.length} entries`);
    wsBroadcast(project.id);
}
