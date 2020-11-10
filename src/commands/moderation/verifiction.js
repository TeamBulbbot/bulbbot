const Emotes = require("../../emotes.json");
const Log = require("../../utils/moderation/log");

module.exports = {
	name: "verification",
	aliases: [""],
	category: "moderation",
	description: "Changes the server verification level",
	usage: "verification <verificationLevel>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_GUILD"],
	userPermissions: ["MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		var level = parseInt(args[0], 10);

		if (isNaN(level)) {
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`verificationLevel\`\`\n${Emotes.other.tools} Correct usage of command: \`\`verification <level>\`\``
			);
		}

		if (level > 4) {
			return message.channel.send(
				`${Emotes.actions.warn} Verification level cannot be grater than \`\`4\`\``
			);
		} else if (level < 0) {
			return message.channel.send(
				`${Emotes.actions.warn} Verification level cannot be less than \`\`0\`\``
			);
		}

		if (message.guild.features.includes("COMMUNITY") && level < 1) {
			return message.channel.send(
				`${Emotes.actions.warn} Verification level cannot be set to \`\`0\`\` for community servers!`
			);
		}

		await message.guild.setVerificationLevel(level);
		message.channel.send(
			`${Emotes.actions.confirm} Server verification level changed to \`\`${level}\`\``
		);

		await Log.Mod_action(
			client,
			message.guild.id,
			`${Emotes.other.wrench} **${message.author.username}**#${message.author.discriminator} (\`\`${message.author.id}\`\`) changed the server verification level to \`\`${level}\`\``,
			""
		);
	},
};
