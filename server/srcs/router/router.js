const express = require("express");
const projectsRouter = require("./projectsRouter");
const ongoingRouter = require("./ongoingRouter");
const Project = require("../mongo_models/Project");
const router = express.Router();

router.use("/projects", projectsRouter);
router.use("/ongoing", ongoingRouter);

const wsClients = new Map();

router.ws("/:project_id/notify", async function (ws, req) {
  const { project_id } = req.params;
  try {
    const project = await Project.findOne({ id: project_id });
    if (!project) throw new Error("Project not found");
    await project.track();
  } catch (err) {
    return ws.close(1008, "Invalid project_id");
  }

  if (!wsClients.has(project_id)) {
    wsClients.set(project_id, {
      payload: { start: [], update: [], end: [] },
      clients: [],
    });
  }
  // ws.project_id = project_id;
  wsClients.get(project_id).clients.push(ws);
  console.log(
    `WebSocket ${project_id}#${wsClients.get(project_id).clients.indexOf(ws)} connection established`,
  );

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

router.use("/", (req, res) => res.sendStatus(404));

module.exports = { router, wsClients };
