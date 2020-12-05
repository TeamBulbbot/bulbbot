const Infraction = require("../../../models/infraction")
const InfractionUtils = require("../../../utils/moderation/infraction")
const Emotes = require("../../../emotes.json")
const Log = require("../../../utils/moderation/log")
const Translator = require("../../../utils/lang/translator")

module.exports = {
	Call: (client, message, args) => {
		if (!message.member.hasPermission("ADMINISTRATOR"))
			return message.channel.send(Translator.Translate("global_missing_permission")).then(msg => {
				msg.delete({timeout: 5000});
				message.delete({timeout: 5000})
			}); // I know best has permission lol
		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				Translator.Translate("infraction_remove_missing_arg_id")
			);

		Infraction.findOne(
			{
				infID: args[1],
				guildID: message.guild.id,
			},
			async (err, infs) => {
				if (infs === null || infs === undefined)
					return message.channel.send(
						`Unable to find infraction with the id \`\`${args[1]}\`\` in **${message.guild.name}**`
					);
				await InfractionUtils.Remove(args[1], message.guild.id);
				message.channel.send(
					`Removed infraction \`\`${args[1]}\`\` in **${message.guild.name}**`
				);
				let reason = args.slice(2).join(" ") || "No reason given";
				await Log.Mod_action(
					client,
					message.guild.id,
					`${Emotes.actions.unban} Infraction \`\`${args[1]}\`\` was removed by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
					""
				);
			}
		);

	},
};
