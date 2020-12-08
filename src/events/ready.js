module.exports = (client) => {
	console.log(
		`------------------\nCurrently logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})\nGuild count: ${client.guilds.cache.size}\nCommand count: ${client.commands.size}\n------------------`
	);
	client.user.setPresence({
		status: "online",
		activity: {
			name: "Version 0.0.1",
			type: "WATCHING",
		},
	});
};
