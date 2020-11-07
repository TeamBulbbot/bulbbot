const Log = require("../utils/moderation/log");
const Emotes = require("../emotes.json");
const Validate = require("../utils/helper/validate");

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

			message = `Nickname change from **${newUser.user.username}**#${newUser.user.discriminator} \`\`(${newUser.user.id})\`\`\n**Old nickname:** ${oNick}\n**New nickname:** ${nNick}`;
			break;
		case "removedrole":
			role = newUser.guild.roles.cache.get(
				oldUser._roles.diff(newUser._roles)[0]
			);

			role.name = await Validate.Master(client, role.name, oldUser.guild);
			message = `Role was removed from **${oldUser.user.username}**#${oldUser.user.discriminator} \`\`(${oldUser.user.id})\`\`, ${role.name} \`\`(${role.id})\`\``;

			break;
		case "newrole":
			role = newUser.guild.roles.cache.get(
				newUser._roles.diff(oldUser._roles)[0]
			);
			message = `Role was added to **${newUser.user.username}**#${newUser.user.discriminator} \`\`(${newUser.user.id})\`\`, ${role.name} \`\`(${role.id})\`\``;
			break;

		default:
			message = "Please contact the developers as this should not happen";
			break;
	}

	Log.Member_Updates(
		client,
		newUser.guild.id,
		`${Emotes.other.wrench} ${message}`
	);
};
