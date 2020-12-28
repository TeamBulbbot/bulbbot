/*
NOT USED
*/

const {client_data} = require("./metrics");

let client;

module.exports = function Init(botObject) {
    client = botObject;
    setTimeout(PassiveGathering, 1000);
};

function PassiveGathering() {
    const totalGuildSize = client.guilds.cache.size;
    const list = client.guilds.cache;
    let totalUserCount = 0;
    list.forEach(guild => {
        totalUserCount += guild.memberCount;
    });

    client_data(totalGuildSize, totalUserCount, client.ws.totalShards, client.ws.ping, client.commands.size);

    setTimeout(PassiveGathering, 1000);
}
