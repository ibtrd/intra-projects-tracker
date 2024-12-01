const express = require("express");
const Project = require("../mongo_models/Project");
const projectsRouter = express.Router();

projectsRouter.get('/:project_id/leaderboard', sendLeaderboard);

module.exports = projectsRouter;

async function sendLeaderboard(req, res) {
    const project = await Project.findOne(
        isNumber(req.params.project_id)
            ? { id: req.params.project_id}
            : { name: req.params.project_id }
    );
    res.send(project);
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }