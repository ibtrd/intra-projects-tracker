const express = require("express");
const ActiveTeam = require("../mongo_models/ActiveTeam");
const ongoingRouter = express.Router();

ongoingRouter.get('/', ongoingProjectUsers);

async function ongoingProjectUsers(req, res) {
    const projectId = req.query.filter ? req.query.filter.project_id : null;
    try {
        const query = await ActiveTeam.find(projectId ? { id: projectId } : {});
        res.send(query);
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports = ongoingRouter;
