const express = require("express");
const projectsRouter = require("./projectsRouter");
const ongoingRouter = require("./ongoingRouter");
const router = express.Router();

router.use('/projects', projectsRouter);
router.use('/ongoing', ongoingRouter);

const wsClients = [];

router.ws('/', function (ws, req) {
    wsClients.push(ws);
    console.log(`WebSocket #${wsClients.length} connection established`);

    ws.on('message', (msg) => {
      console.log('Websocket received: ', msg);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        const index = wsClients.indexOf(ws);
        if (index !== -1) {
            wsClients.splice(index, 1);
        }
    });
});

router.use('/', (req, res) => res.sendStatus(404));

module.exports = { router, wsClients };
