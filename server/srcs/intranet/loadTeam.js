const Project = require("../mongo_models/Project");
const Team = require("../mongo_models/Team");
const { wsAddtoPayload } = require("../websocket/websocket");

async function loadTeam(team) {
  if (await Team.findOne({ id: team.id })) {
    return;
  }
  const project = await Project.findOne({ id: team.project_id });
  await Team.create({ id: team.id });
  wsAddtoPayload("projects", {
    link: `https://projects.intra.42.fr/projects/${team.project_id}/projects_users/${team.users[0].projects_user_id}`,
    users: team.users.map((user) => user.login),
    project: project.name,
    grade: team.final_mark,
    validated: team["validated?"],
    flags: team.scale_teams.map(scale => {
      return { name: scale.flag.name, positive: scale.flag.positive }
    }),
  });
  if (team["validated?"]) {
    console.log(
      `${team.users.map((user) => user.login).join("/")} validated ${
        project.name
      } with a grade of ${team.final_mark}`
    );
  } else {
    console.log(
      `${team.users.map((user) => user.login).join("/")} failed ${
        project.name
      } with a grade of ${team.final_mark}`
    );
  }
}

module.exports = { loadTeam };