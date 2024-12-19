const ActiveExam = require("../mongo_models/ActiveExam");
const { wsAddtoPayload } = require("../websocket/websocket");

async function teamStart(intraTeam, project, user) {
  console.log(`${user.login} started ${project.name}!`);
  const activeTeam = await ActiveExam.create({
    id: intraTeam.team.id,
    user: user,
    image: intraTeam.user.image.link,
    project: project,
    grade: intraTeam.team.final_mark,
    closed_at: intraTeam.team.closed_at,
  });
  wsAddtoPayload(project.id, {
    type: 'begin',
    login: user.login,
    image: intraTeam.user.image.link,
    grade: intraTeam.team.final_mark,
    closed_at: intraTeam.team.closed_at
  });
  return activeTeam;
};

module.exports = { teamStart };
