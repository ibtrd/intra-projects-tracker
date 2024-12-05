const ActiveTeam = require("../mongo_models/ActiveTeam");
const { wsAddtoPayload } = require("../websocket/websocket");

module.exports.teamStart = async function (intraTeam, project, user) {
  console.log(`${user.login} started ${project.name}!`);
  const activeTeam = await ActiveTeam.create({
    id: intraTeam.id,
    user: user,
    project: project,
    grade: intraTeam.final_mark,
    closed_at: intraTeam.closed_at,
  });
  wsAddtoPayload(project.id, "start", {
    login: user.login,
    grade: intraTeam.final_mark,
  });
  return activeTeam;
};
