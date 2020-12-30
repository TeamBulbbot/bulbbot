const client = require("prom-client");

const clientEvent = new client.Counter({
	name: "client_event",
	help: "Different emitted client events",
	labelNames: ["event_type"],
});

const clientCommandUsage = new client.Counter({
	name: "client_command_usage",
	help: "Amount of uses on the commands",
	labelNames: ["command_name"],
});

const activityGuilds = new client.Counter({
	name: "activity_guilds",
	help: "The activity in a guild",
	labelNames: ["guild_id"],
});

const totalGuilds = new client.Gauge({
	name: "total_guild",
	help: "How many guilds the bot is in",
});

const totalMembers = new client.Gauge({
	name: "total_member_count",
	help: "How many members that the bot see",
});

const clientPing = new client.Gauge({
	name: "client_ws_ping",
	help: "Current ping of the bot",
});

module.exports = {
	client_event: eventType => {
		clientEvent.inc({ event_type: eventType });
	},
	client_command_usage: commandName => {
		clientCommandUsage.inc({ command_name: commandName });
	},
	activity_guilds: guildId => {
		activityGuilds.inc({ guild_id: guildId });
	},
	total_guilds: guildCount => {
		totalGuilds.set(guildCount);
	},
	total_members: members => {
		totalMembers.set(members);
	},
	client_ping: ping => {
		clientPing.set(ping);
	},
};
