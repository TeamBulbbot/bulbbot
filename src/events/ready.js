const Event = require("../structures/Event");
const { TempbanRestore, TempmuteRestore } = require("../utils/moderation/temp");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true,
		});
	}

	async run() {
		this.client.user.setPresence({
			status: global.config.client.status,
			activity: {
				name: global.config.client.game,
				type: global.config.client.type,
			},
		});
		console.log("[CLIENT - Temp Bans] Started to restore temp bans...");
		await TempbanRestore(this.client);
		console.log("[CLIENT - Mutes] Started to restore mutes");
		await TempmuteRestore(this.client);

		console.log(
			[
				`[CLIENT] ${this.client.user.username} successfully logged and ready`,
				`[CLIENT] Listening to ${this.client.commands.size} command(s)`,
				`[CLIENT] Listening to ${this.client.events.size} event(s)`,
			].join("\n"),
		);
	}
};
