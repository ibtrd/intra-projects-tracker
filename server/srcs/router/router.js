const express = require("express");
const projectsRouter = require("./projectsRouter");
const ongoingRouter = require("./ongoingRouter");
const Project = require("../mongo_models/Project");
const router = express.Router();

router.use('/projects', projectsRouter);
router.use('/ongoing', ongoingRouter);

const wsClients = new Map();

router.ws('/:project_id/notify', async function (ws, req) {
    const { project_id } = req.params;
    try {
        const project = await Project.findOne({ id: project_id });
        if (!project)
            throw new Error("Project not found");
    } catch (err) {
        return ws.close(1008, "Invalid project_id");
    }

    if (!wsClients.has(project_id)) {
        wsClients.set(project_id, []);
    }
    ws.project_id = project_id;
    wsClients.get(project_id).push(ws);
    console.log(`WebSocket ${project_id}#${wsClients.get(project_id).length} connection established`);

    ws.on('message', (msg) => {
      console.log('Websocket received: ', msg);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        const projectClients = wsClients.get(ws.project_id);
        const index = projectClients.indexOf(ws)
        if (index !== -1) {
            projectClients.splice(index, 1);
        }
        if (projectClients.length === 0) {
            wsClients.delete(project_id);
        }
    });
});

router.use('/', (req, res) => res.sendStatus(404));

module.exports = { router, wsClients };
