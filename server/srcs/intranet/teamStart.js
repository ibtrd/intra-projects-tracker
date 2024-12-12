const ActiveExam = require("../mongo_models/ActiveExam");
const { wsAddtoPayload } = require("../websocket/websocket");

async function teamStart(intraTeam, project, user) {
  console.log(`${user.login} started ${project.name}!`);
  const activeTeam = await ActiveExam.create({
    id: intraTeam.id,
    user: user,
    project: project,
    grade: intraTeam.final_mark,
    closed_at: intraTeam.closed_at,
  });
  wsAddtoPayload(project.id, {
    type: 'begin',
    login: user.login,
    grade: intraTeam.final_mark,
    closed_at: intraTeam.closed_at
  });
  return activeTeam;
};

module.exports = { teamStart };
