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

module.exports = {
	client_event: function client_event(eventType) {
		clientEvent.inc({ event_type: eventType });
	},
	client_command_usage: function client_command_usage(commandName) {
		clientCommandUsage.inc({ command_name: commandName });
	},
	activity_guilds: function activity_guilds(guildId) {
		activityGuilds.inc({ guild_id: guildId });
	},
};
