const express = require("express");
const ActiveExam = require("../mongo_models/ActiveExam");
const ongoingRouter = express.Router();

ongoingRouter.get("/", ongoingProjectUsers);

async function ongoingProjectUsers(req, res) {
  const projectId = req.query.filter ? req.query.filter.project_id : null;
  try {
    const query = await ActiveExam.find(projectId ? { id: projectId } : {})
      .populate("user")
      .populate("project");
    const payload = query.map((entry) =>{
      return {
        login: entry.user.login,
        image: entry.image,
        project: {
          name: entry.project.name,
          id: entry.project.id,
        },
        grade: entry.grade,
        closed_at: entry.closed_at,
      };
    });
    res.send(
      payload.sort((a, b) => {
        if (b.grade !== a.grade) {
          return b.grade - a.grade;
        }
        return new Date(a.closed_at) - new Date(b.closed_at);
      })
    );
  } catch (err) {
    return res.status(400).send(err);
  }
}

module.exports = ongoingRouter;
