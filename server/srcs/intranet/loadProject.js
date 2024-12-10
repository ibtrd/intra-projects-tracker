const LoggedProject = require("../mongo_models/LoggedProject");
const User = require("../mongo_models/User");
const { wsAddtoPayload } = require("../websocket/websocket");
const { api42 } = require("./api42");

async function loadProject(project, options) {
  console.log(`Loading: ${project.name} (${project.id})`);
  const query = await api42.getProjectProjectUsers(project.id, options);
  for (const entry of query) {
    if (entry.user["staff?"] || !entry.user["active?"] || !entry.teams.length) {
      continue;
    }
    const user = await User.getById(entry.user);
    entry.team = entry.teams[entry.teams.length - 1];
    let projectTeam = await LoggedProject.findOne({ id: entry.team.id });
    if (!projectTeam && entry.team.status === "finished") {
      await LoggedProject.create({
        id: entry.team.id,
        user: user,
        project: project,
        grade: entry.team.final_mark,
        validated: entry.team["validated?"],
        closed_at: entry.team.closed_at,
      });
      wsAddtoPayload('projects', {
        link: `https://projects.intra.42.fr/projects/${project.id}/projects_users/${entry.id}`,
        users: entry.team.users.map((user) => user.login),
        project: project.name,
        grade: entry.team.final_mark,
        validated: entry.team["validated?"],
      });
      if (entry.team["validated?"]) {
        console.log(
          `${entry.team.users.map((user) => user.login).join("/")} validated ${
            project.name
          } with a grade of ${entry.team.final_mark}`
        );
      } else {
        console.log(
          `${entry.team.users.map((user) => user.login).join("/")} failed ${
            project.name
          } with a grade of ${entry.team.final_mark}`
        );
      }
    }
  }
}

module.exports = loadProject;
