const Command = require("../../structures/Command");
const Discord = require("discord.js");
const { createInfraction, deleteInfraction, getInfraction } = require("../../utils/InfractionUtils");
const Emotes = require("../../emotes.json");
const { ReasonImage } = require("../../utils/Regex");

const moment = require("moment");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Infraction Desc",
			category: "Moderation",
			aliases: ["inf"],
			usage: "!infraction <action>",
			userPerms: ["MANAGE_GUILD"],
			clearance: 50,
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
		});
	}

	async run(message, args) {
		//const target = await this.client.users.fetch(args[1].replace(NonDigits, ""));
		switch (args[0].toLowerCase()) {
			case "create":
			case "add":
				const id = await createInfraction(
					message.guild.id,
					"ban",
					"false",
					"big sleep",
					target.tag,
					target.id,
					message.author.tag,
					message.author.id,
				);
				message.channel.send("Created an infraction for ``" + target.tag + "`` with the id of ``" + id + "``");
				break;

			case "delete":
			case "remove":
				if (!args[1])
					return message.channel.send(
						this.client.bulbutils.translate("event_message_args_missing", {
							arg: "infraction:int",
							arg_expected: 2,
							arg_provided: 1,
							usage: "!infraction delete <infraction>",
						}),
					);

				if (!(await deleteInfraction(message.guild.id, args[1]))) {
					return message.channel.send(
						this.client.bulbutils.translate("infraction_not_found", {
							infractionId: args[1],
						}),
					);
				}

				message.channel.send(
					this.client.bulbutils.translate("infraction_delete_success", {
						infractionId: args[1],
					}),
				);
				break;

			case "info":
				if (!args[1])
					return message.channel.send(
						this.client.bulbutils.translate("event_message_args_missing", {
							arg: "infraction:int",
							arg_expected: 2,
							arg_provided: 1,
							usage: "!infraction info <infraction>",
						}),
					);

				if (!(await getInfraction(message.guild.id, args[1]))) {
					return message.channel.send(
						this.client.bulbutils.translate("infraction_not_found", {
							infractionId: args[1],
						}),
					);
				}

				const inf = await getInfraction(message.guild.id, args[1]);
				const user = await this.client.bulbutils.userObject(false, await this.client.users.fetch(inf.TargetId));

				let description = "";
				description += this.client.bulbutils.translate("infraction_info_inf_id", { infractionId: args[1] });
				description += this.client.bulbutils.translate("infraction_info_target", {
					target_tag: inf.Target,
					target_id: inf.TargetId,
				});
				description += this.client.bulbutils.translate("infraction_info_moderator", {
					moderator_tag: inf.Moderator,
					moderator_id: inf.ModeratorId,
				});
				description += this.client.bulbutils.translate("infraction_info_created", {
					timestamp: moment(Date.parse(inf.createdAt)).format("MMM Do YYYY, h:mm:ss a"),
				});

				if (inf.Active !== "false" && inf.Active !== "true") {
					description += this.client.bulbutils.translate("infraction_info_expires", {
						timestamp: `${Emotes.status.ONLINE} ${moment(parseInt(inf.Active)).format("MMM Do YYYY, h:mm:ss a")}`,
					});
				} else {
					description += this.client.bulbutils.translate("infraction_info_active", {
						emoji: prettify(inf.Active),
					});
				}

				description += this.client.bulbutils.translate("infraction_info_reason", {
					reason: inf.Reason,
				});

				const image = inf.Reason.match(ReasonImage);

				const embed = new Discord.MessageEmbed()
					.setTitle(prettify(inf.Action))
					.setDescription(description)
					.setColor(process.env.EMBED_COLOR)
					.setImage(image ? image[0] : null)
					.setThumbnail(user.avatarUrl)
					.setFooter(
						this.client.bulbutils.translate("global_executed_by", {
							user_name: message.author.username,
							user_discriminator: message.author.discriminator,
						}),
						message.author.avatarURL(),
					)
					.setTimestamp();

				message.channel.send(embed);
				break;

			default:
				break;
		}
	}
};

function prettify(action) {
	let finalString = "";
	switch (action) {
		case "Ban":
			finalString = `${Emotes.actions.BAN} Ban`;
			break;
		case "Forceban":
			finalString = `${Emotes.actions.BAN} Forceban`;
			break;
		case "Kick":
			finalString = `${Emotes.actions.KICK} Kick`;
			break;
		case "Mute":
			finalString = `${Emotes.actions.MUTE} Mute`;
			break;
		case "Warn":
			finalString = `${Emotes.actions.WARN} Warn`;
			break;
		case "Unmute":
			finalString = `${Emotes.actions.UNBAN} Unmute`;
			break;
		case "Unban":
			finalString = `${Emotes.actions.UNBAN} Unban`;
			break;
		case "true":
			finalString = `${Emotes.status.ONLINE} True`;
			break;
		case "false":
			finalString = `${Emotes.other.INF2} False`;
			break;
	}

	return finalString;
}
