const { total_guilds, total_members, client_ping } = require("./metrics");

let client;
module.exports = botObject => {
	client = botObject;
	setTimeout(PassiveGathering, 1000 * 30);
};

function PassiveGathering() {
	const totalGuildSize = client.guilds.cache.size;
	const list = client.guilds.cache;
	let totalUserCount = 0;
	list.forEach(guild => {
		totalUserCount += guild.memberCount;
	});

	total_guilds(totalGuildSize);
	total_members(totalUserCount);
	client_ping(client.ws.ping);

	setTimeout(PassiveGathering, 1000 * 30);
}
