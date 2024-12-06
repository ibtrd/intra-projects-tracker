const express = require("express");
const Project = require("../mongo_models/Project");
const { api42 } = require("../intranet/api42");
const projectsRouter = express.Router();

projectsRouter.get("/", sendProjects);
projectsRouter.get("/:project_id/leaderboard", sendLeaderboard);

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
