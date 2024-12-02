const { wsClients } = require("./router")

module.exports.wsBroadcast = function (message) {
    wsClients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(message);
        }
    });
}
