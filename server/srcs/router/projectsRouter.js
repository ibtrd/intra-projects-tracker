const express = require("express");
const Project = require("../mongo_models/Project");
const { api42 } = require("../intranet/api42");
const projectsRouter = express.Router();

projectsRouter.get('/:project_id/leaderboard', sendLeaderboard);

module.exports = projectsRouter;

async function sendLeaderboard(req, res) {
    const leaderboard = [];
    const project = await Project.findOne(
        isNumber(req.params.project_id)
            ? { id: req.params.project_id}
            : { name: req.params.project_id }
    );
    if (!project)
        return res.send(400);
    const query = await api42.getProjectProjectUsers(project.id);
    query.forEach(entry => {
        if (entry.final_mark === null) return;
        leaderboard.push({
            rank: 0,
            login: entry.user.login,
            grade: entry.final_mark
        })
    })
    leaderboard.sort((a, b) => b.grade - a.grade);
    let rank = 1;
    leaderboard.forEach(e => e.rank = rank++)
    res.send(leaderboard);
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }
