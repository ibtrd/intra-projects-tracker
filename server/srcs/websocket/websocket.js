const wsClients = new Map();

function wsAddtoPayload(id, data) {
  id = id.toString();
  if (!wsClients.has(id)) {
    return;
  }
  wsClients.get(id).payload.push(data);
}

function wsBroadcastExam(id) {
  id = id.toString();
  if (!wsClients.has(id)) {
    return;
  }
  const clients = wsClients.get(id).clients;
  const payload = wsClients.get(id).payload;
  if (!payload.length) {
    return;
  }
  clients.forEach((ws, index) => {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'update', payload: payload }));
      } catch (err) {
        console.error("Failed to send message to websocket:", err.message);
      }
    } else {
      console.log(`Removing closed WebSocket for ID: ${id}`);
      clients.splice(index, 1);
    }
  });
  wsClients.get(id).payload = [];
}

function wsBroadcastProjects() {
  id = "projects";
  if (!wsClients.has(id)) {
    return;
  }
  const clients = wsClients.get(id).clients;
  const payload = wsClients.get(id).payload;
  if (!payload.length)
    return;
  clients.forEach((ws, index) => {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'update', payload: payload }));
      } catch (err) {
        console.error("Failed to send message to websocket:", err.message);
      }
    } else {
      console.log(`Removing closed WebSocket for ID: ${id}`);
      clients.splice(index, 1);
    }
  });
  wsClients.get(id).payload = [];
}

module.exports = {
  wsClients,
  wsAddtoPayload,
  wsBroadcastExam,
  wsBroadcastProjects,
};
