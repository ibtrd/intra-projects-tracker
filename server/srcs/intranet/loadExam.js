const ActiveExam = require("../mongo_models/ActiveExam");
const User = require("../mongo_models/User");
const { wsBroadcastExam, wsAddtoPayload } = require("../websocket/websocket");
const { api42 } = require("./api42");
const { teamStart } = require("./teamStart");

async function loadExam(project, options) {
  console.log(`Loading: ${project.name} (${project.id})`);
  const query = await api42.getProjectProjectUsers(project.id, options);
  for (const entry of query) {
    if (entry.user["staff?"] || !entry.user["active?"]) {
      continue;
    }
    const user = await User.getById(entry.user);
    entry.team = entry.teams[entry.teams.length - 1];
    let activeTeam = await ActiveExam.findOne({ id: entry.team.id });
    if (activeTeam) {
      if (entry.team.closed_at && !activeTeam.closed_at) {
        activeTeam.closed_at = entry.team.closed_at;
        activeTeam.grade = entry.team.final_mark;
        await activeTeam.save();
        console.log(`${user.login} finished ${project.name}`);
        wsAddtoPayload(project.id, {
          type: "end",
          login: user.login,
          grade: entry.team.final_mark,
          closed_at: entry.team.closed_at,
        });
      } else if (
        !activeTeam.closed_at &&
        entry.team.status === "in_progress" &&
        entry.team.final_mark != activeTeam.grade
      ) {
        activeTeam.grade = entry.team.final_mark;
        await activeTeam.save();
        wsAddtoPayload(project.id, {
          type: "update",
          login: user.login,
          grade: entry.team.final_mark,
          closed_at: entry.team.closed_at
        });
        console.log(`${user.login} - ${project.name} - ${activeTeam.grade}`);
      }
    } else if (
      entry.team.final_mark != null &&
      entry.team.status === "in_progress"
    ) {
      await teamStart(entry.team, project, user);
    }
  }
  wsBroadcastExam(project.id);
}

module.exports = loadExam;
