const Mute = require("../../models/mute");
const Remind = require("../../models/remind");
const Guild = require("../../models/guild");
const Tempban = require("../../models/tempban");
const SendLog = require("../moderation/log");
const Moderation = require("../moderation/moderation");
const Emotes = require("../../emotes.json");
const Logger = require("../../utils/other/winston");
const Infraction = require("../moderation/infraction");

const moment = require("moment");

module.exports = {
	Mute: (client) => {
		const unix = moment().unix();

		Mute.find({}, async (err, mutes) => {
			if (err) Logger.error(err);
			mutes.forEach((mute) => {
				if (unix >= mute.expireTime) {
					Guild.findOne(
						{
							guildID: mute.guildID,
						},
						async (err, fGuild) => {
							if (err) Logger.error(err);

							let guild = client.guilds.cache.get(mute.guildID);
							let user = guild.member(mute.targetID);

							if (
								user.roles.cache.has(fGuild.roles.mute) &&
								user !== undefined
							) {
								user.roles
									.remove(fGuild.roles.mute)
									.catch((err) => Logger.error(err));

								await SendLog.Mod_action(
									client,
									mute.guildID,
									`${Emotes.actions.unban} Unmuted **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` by **automatically unmuted**  `,
									""
								);
							}

							Mute.findOneAndDelete({ _id: mute._id }, (err, _res) => {
								if (err) Logger.error(err);
							});
						}
					);
				}
			});
		});
	},

	Remind: (client) => {
		const unix = moment().unix();

		Remind.find({}, async (err, reminds) => {
			reminds.forEach(async (remind) => {
				if (unix >= remind.expireTime) {
					if (remind.dmRemind) {
						let user = await client.users.fetch(remind.userID);

						user.send(`

:alarm_clock: **Driiiiing**

**Reminder**
>>> ${remind.reminder}
					`);
					} else {
						client.channels.cache.get(remind.channelID).send(`
<@${remind.userID}>
:alarm_clock: **Driiiiing**
					
**Reminder**
>>> ${remind.reminder}
										`);
					}

					Remind.findOneAndDelete({ _id: remind._id }, (err, _res) => {
						if (err) Logger.error(err);
					});
				}
			});
		});
	},

	Tempban: (client) => {
		const unix = moment().unix();

		Tempban.find({}, (err, bans) => {
			if (err) Logger.error(err);
			bans.forEach(async (ban) => {
				if (unix >= ban.expireTime) {
					const user = await client.users.fetch(ban.targetID);
					const guild = client.guilds.cache.get(ban.guildID);

					Infraction.Add(
						ban.guildID,
						"Unban",
						ban.targetID,
						client.user.id,
						`Automatically unbanned`
					);
					await guild.members.unban(
						ban.targetID,
						`Unbanned ${user.username}#${user.discriminator} (${user.id}) by automatically unbanned`
					);

					await SendLog.Mod_action(
						client,
						ban.guildID,
						`${Emotes.actions.unban} Unbanned **${user.username}**#${user.discriminator} \`\`(${user.id})\`\` by **automatically unbanned**  `,
						""
					);

					Tempban.findOneAndDelete({ _id: ban._id }, (err, _res) => {
						if (err) Logger.error(err);
					});
				}
			});
		});
	},
};
