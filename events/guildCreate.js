const mongoose = require("mongoose");
const Guild = require("../models/guild");
const { eventNames } = require("../models/guild");
var clc = require("cli-color");

module.exports = async (client, guild) => {
	guild = new Guild({
		_id: mongoose.Types.ObjectId(),
		guildID: guild.id,
		guildName: guild.name,
		guildPrefix: process.env.PREFIX,
		joinDate: new Date(),
	});

	guild.save().catch((err) => console.error(clc.red(err)));

	console.log(clc.green("[+] Joined new server"));
};
