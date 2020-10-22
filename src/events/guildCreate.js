const Guild = require("../utils/database/guild");
const clc = require("cli-color");

module.exports = async (_client, guild) => {
	Guild.Add(guild);
	console.log(clc.green("[+] Joined new server"));
};
