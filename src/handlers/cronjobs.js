const Mute = require("../models/mute");
const Roles = require("../models/role");
const SendLog = require("./SendLog");
const Emotes = require("../emotes.json");

const moment = require("moment");
const clc = require("cli-color");

module.exports = {
	Mute: (client) => {
		const unix = moment().unix();

		Mute.find({}, async (err, mutes) => {
			mutes.forEach((mute) => {
				if (unix >= mute.expireTime) {
					Roles.findOne(
						{
							guildID: mute.guildID,
						},
						async (err, roles) => {
							if (err) console.error(clc.red(err));

							let guild = client.guilds.cache.get(mute.guildID);
							let user = guild.member(mute.targetID);

							if (user.roles.cache.has(roles.mute)) {
								user.roles.remove(roles.mute).catch(console.error);

								await SendLog.Mod_action(
									client,
									mute.guildID,
									`${Emotes.actions.unban} Unmuted **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` by **automatically unmuted**  `,
									""
								);
							}

							Mute.findOneAndDelete({ _id: mute._id }, (err, _res) => {
								if (err) console.error(clc.red(err));
							});
						}
					);
				}
			});
		});
	},
};
