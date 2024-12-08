const wsClients = new Map();

function wsAddtoPayload(id, key, data) {
  console.log('PUSHING payload:' , data);
  id = id.toString();
  if (!wsClients.has(id)) {
    return;
  }
  if (id === "projects") {
    wsClients.get(id).payload.push(data);
  } else {
    wsClients.get(id).payload[key].push(data);
  }
}

function wsBroadcastExam(id) {
  id = id.toString();
  if (!wsClients.has(id)) {
    return;
  }
  const clients = wsClients.get(id).clients;
  const payload = wsClients.get(id).payload;
  if (!payload.start.length && !payload.update.length && !payload.end.length) {
    return;
  }
  clients.forEach((ws, index) => {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify(payload));
      } catch (err) {
        console.error("Failed to send message to websocket:", err.message);
      }
    } else {
      console.log(`Removing closed WebSocket for ID: ${id}`);
      clients.splice(index, 1);
    }
  });
  wsClients.get(id).payload = { start: [], update: [], end: [] };
}

function wsBroadcastProjects() {
  id = "projects";
  if (!wsClients.has(id)) {
    return;
  }
  const clients = wsClients.get(id).clients;
  const payload = wsClients.get(id).payload;
  clients.forEach((ws, index) => {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify(payload));
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
