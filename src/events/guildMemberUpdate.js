const Log = require("../utils/moderation/log");
const Emotes = require("../emotes.json");
const Validate = require("../utils/helper/validate");
const Translator = require("../utils/lang/translator")

Array.prototype.diff = function (a) {
	return this.filter(function (i) {
		return a.indexOf(i) < 0;
	});
};

module.exports = async (client, oldUser, newUser) => {
	let change = "";

	if (oldUser._roles.length !== newUser._roles.length)
		oldUser._roles.length < newUser._roles.length
			? (change = "newrole")
			: (change = "removedrole");
	else if (oldUser.nickname !== newUser.nickname) change = "nickname";
	else return;

	let message = "";
	let role = "";

	switch (change) {
		case "nickname":
			if (oldUser.nickname === null) oldUser.nickname = oldUser.user.username;
			if (newUser.nickname === null) newUser.nickname = newUser.user.username;

			let oNick = await Validate.Master(
				client,
				oldUser.nickname,
				oldUser.guild
			);
			let nNick = await Validate.Master(
				client,
				newUser.nickname,
				newUser.guild
			);
			
			message = Translator.Translate("event_guild_member_update_nickname", {
				user: newUser.user.username,
				user_discriminator: newUser.user.discriminator,
				user_id: newUser.user.id,
				nick_old: oNick,
				nick_new: nNick
			})
			break;
		case "removedrole":
			role = newUser.guild.roles.cache.get(
				oldUser._roles.diff(newUser._roles)[0]
			);

			role.name = await Validate.Master(client, role.name, oldUser.guild);
			message = Translator.Translate("event_guild_member_update_role_remove", {
				user: oldUser.user.username,
				user_discriminator: oldUser.user.discriminator,
				user_id: oldUser.user.id,
				role: role.name
			})

			break;
		case "newrole":
			role = newUser.guild.roles.cache.get(
				newUser._roles.diff(oldUser._roles)[0]
			);
			message = Translator.Translate("event_guild_member_update_role_add", {
				user: oldUser.user.username,
				user_discriminator: oldUser.user.discriminator,
				user_id: oldUser.user.id,
				role: role.name
			})
			break;

		default:
			message = "Please contact the developers as this should not happen";
			break;
	}

	await Log.Member_Updates(
		client,
		newUser.guild.id,
		`${Emotes.other.wrench} ${message}`
	);
};
