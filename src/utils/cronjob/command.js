const Mute = require("../../models/mute");
const Remind = require("../../models/remind");
const Guild = require("../../models/guild");
const Tempban = require("../../models/tempban");
const SendLog = require("../moderation/log");
const Emotes = require("../../emotes.json");
const Logger = require("../../utils/other/winston");
const Infraction = require("../moderation/infraction");
const Translator = require("../../utils/lang/translator");

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
								user !== undefined &&
								user.roles === null &&
								user.roles.cache.has(fGuild.roles.mute)
							) {
								user.roles
									.remove(fGuild.roles.mute, Translator.Translate("mute_audit"))
									.catch((err) => Logger.error(err));

								await SendLog.Mod_action(
									client,
									mute.guildID,
									Translator.Translate("mute_unmuted", {
										user: user.user.username,
										user_discriminator: user.user.discriminator,
										user_id: user.user.id,
									}),
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
						Translator.Translate("tempban_audit")
					);

					await SendLog.Mod_action(
						client,
						ban.guildID,
						Translator.Translate("tempban_unban", {
							user: user.username,
							user_discriminator: user.discriminator,
							user_id: user.id,
						}),
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
