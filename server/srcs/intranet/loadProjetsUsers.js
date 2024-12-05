const e = require("express");
const ActiveTeam = require("../mongo_models/ActiveTeam");
const Project = require("../mongo_models/Project");
const ProjectUser = require("../mongo_models/ProjectUser");
const User = require("../mongo_models/User");
const { wsBroadcast, wsAddtoPayload } = require("../websocket/websocket");
const { api42 } = require("./api42");
const { teamStart } = require("./teamStart");

module.exports.loadProjectUsers = async function () {
  const projects = await Project.find({ tracking: true });
  const options = {
    filter: { campus: 9 },
    range: {
      updated_at: [dateMinutesAgo(5).toISOString(), "2042-01-01T00:00:00.000Z"],
    },
  };
  try {
    for (const project of projects) {
      await loadProject(project, options);
    }
  } catch (err) {
    console.error(`Failed to fetch intranet: ${err.message}`);
  }
};

function dateMinutesAgo(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date;
}

async function loadProject(project, options) {
  console.log(`Loading: ${project.name} (${project.id})`);
  const query = await api42.getProjectProjectUsers(project.id, options);
  for (const entry of query) {
    if (entry.user["staff?"] || !entry.user["active?"]) {
      // console.warn(`ignored user: ${entry.user.login}`);
      continue;
    }
    const user = await User.getById(entry.user);
    entry.team = entry.teams[entry.teams.length - 1];
    let activeTeam = await ActiveTeam.findOne({ id: entry.team.id });
    if (activeTeam) {
      if (entry.team.closed_at && !activeTeam.closed_at) {
        activeTeam.closed_at = entry.team.closed_at;
        await activeTeam.save();
        console.log(`${user.login} finished ${project.name}`);
        wsAddtoPayload(project.id, "end", {
          login: user.login,
          grade: entry.team.final_mark,
        });
      } else if (
        entry.team.status === "in_progress" &&
        entry.team.final_mark > activeTeam.grade
      ) {
        activeTeam.grade = entry.team.final_mark;
        await activeTeam.save();
        wsAddtoPayload(project.id, "update", {
          login: user.login,
          grade: entry.team.final_mark,
        });
        console.log(`${user.login} - ${project.name} - ${activeTeam.grade}`);
      }
    } else if (
      entry.team.final_mark != null &&
      entry.team.status === "in_progress"
    ) {
      await teamStart(entry.team, project, user);
    }
    const projectUser = await ProjectUser.syncIntra(project, user, entry);
  }
  console.log(`processed ${query.length} entries`);
  wsBroadcast(project.id);
}
