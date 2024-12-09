const express = require("express");
const Project = require("../mongo_models/Project");
const { wsClients } = require("../websocket/websocket");
const { sendExams } = require("../intranet/sendExams");
const examsRouter = express.Router();

examsRouter.get("/", sendExams);

examsRouter.ws("/:project_id/notify", async function (ws, req) {
  const { project_id } = req.params;
  let project;
  try {
    project = await Project.findOne({ id: project_id });
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
  wsClients.get(project_id).clients.push(ws);
  console.log(
    `WebSocket exam-${project_id}#${wsClients
      .get(project_id)
      .clients.indexOf(ws)} connection established`
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

module.exports = examsRouter;
