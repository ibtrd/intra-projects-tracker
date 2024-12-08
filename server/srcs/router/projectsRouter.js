const express = require("express");
const Project = require("../mongo_models/Project");
const { api42 } = require("../intranet/api42");
const { wsClients } = require("../websocket/websocket");
const projectsRouter = express.Router();

projectsRouter.get("/", sendProjects);
projectsRouter.get("/:project_id/leaderboard", sendLeaderboard);

projectsRouter.ws("/notify", async function (ws, req) {
  const project_id = 'projects';
  if (!wsClients.has(project_id)) {
    wsClients.set(project_id, {
      payload: [],
      clients: [],
    });
  }
  wsClients.get(project_id).clients.push(ws);
  console.log(
    `WebSocket ${project_id}#${wsClients.get(project_id).clients.indexOf(ws)} connection established`,
  );
  // ws.send(JSON.stringify({ welcome: { activeteams: getActiveExams(project) }}));

  ws.on("message", (msg) => {
    console.log("Websocket received: ", msg);
  });

  ws.on("close", async () => {
    const index = wsClients.get(project_id).clients.indexOf(ws);
    wsClients.get(project_id).clients.splice(index, 1);
    console.log(`WebSocket ${project_id}#${index} connection closed`);
    if (!wsClients.get(project_id).clients.length) {
      wsClients.delete(project_id);
      const project = await Project.findOne({ id: project_id });
      await project.untrack();
    }
  });


});
async function sendProjects(req, res) {
  const projects = await Project.find({});
  if (!projects) {
    res.sendStatus(500);
  }
  res.send(
    projects.map((project) => {
      return {
        id: project.id,
        name: project.name,
        exam: project.exam
      };
    }),
  );
}

async function sendLeaderboard(req, res) {
  const leaderboard = [];
  const project = await Project.findOne({ id: req.params.project_id });
  if (!project) return res.send(400);
  const query = await api42.getProjectProjectUsers(project.id);
  query.forEach((entry) => {
    if (entry.final_mark === null) return;
    leaderboard.push({
      rank: 0,
      login: entry.user.login,
      grade: entry.final_mark,
    });
  });
  leaderboard.sort((a, b) => b.grade - a.grade);
  let rank = 1;
  leaderboard.forEach((e) => (e.rank = rank++));
  res.send(leaderboard);
}

module.exports = projectsRouter;
