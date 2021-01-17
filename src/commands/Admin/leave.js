const Command = require("../../structures/Command");
const Emotes = require("../../emotes.json");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Leaves the specified guild",
			category: "Admin",
			usage: "!leave <guild>",
			examples: ["leave 742094927403679816"],
			argList: ["guild:Guild"],
			minArgs: 1,
			maxArgs: 1,
			devOnly: true,
		});
	}

	async run(message, args) {
		let guild;
		try {
			guild = await this.client.guilds.fetch(args[0]);
		} catch (err) {
			return message.channel.send("Could not fetch the specified guild!");
		}

		message.channel.send(`Are you sure you want the bot to leave **${guild.name}**?`).then(msg => {
			msg.react(Emotes.other.success.replace(NonDigits, "")).then(() => {
				msg.react(Emotes.other.fail.replace(NonDigits, ""));
			});

			const filter = (reaction, user) => {
				return (
					[Emotes.other.success.replace(NonDigits, ""), Emotes.other.fail.replace(NonDigits, "")].includes(reaction.emoji.id) &&
					user.id === message.author.id
				);
			};

			msg
				.awaitReactions(filter, {
					max: 1,
					time: 60000,
					errors: ["time"],
				})
				.then(async collected => {
					const reaction = collected.first();

					// BUG (p4)
					// if you try to the current guild where the command is fired
					// the bot will crash
					if (reaction.emoji.id === Emotes.other.success.replace(NonDigits, "")) {
						guild.leave();
						await msg.reactions.removeAll();
						return message.channel.send("Sir yes sir, bot yeeted");
					} else if (reaction.emoji.id === Emotes.other.fail.replace(NonDigits, "")) {
						await msg.reactions.removeAll();
						return message.channel.send("Operation canceled");
					}
				});
		});
	}
};
