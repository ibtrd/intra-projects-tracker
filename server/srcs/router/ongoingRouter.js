const express = require("express");
const ActiveTeam = require("../mongo_models/ActiveTeam");
const ongoingRouter = express.Router();

ongoingRouter.get("/", ongoingProjectUsers);

async function ongoingProjectUsers(req, res) {
  const projectId = req.query.filter ? req.query.filter.project_id : null;
  try {
    const query = await ActiveTeam.find(projectId ? { id: projectId } : {})
      .populate("user")
      .populate("project");
    const payload = query.map((entry) => {
      return {
        login: entry.user.login,
        project: {
          name: entry.project.name,
          id: entry.project.id,
        },
        grade: entry.grade,
        closed_at: entry.closed_at,
      };
    });
    res.send(payload.sort((a, b) => b.grade - a.grade));
  } catch (err) {
    return res.status(400).send(err);
  }
}

module.exports = ongoingRouter;
