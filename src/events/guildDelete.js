const Guild = require("../utils/database/guild");
const clc = require("cli-color");

module.exports = async (_client, guild) => {
	Guild.Remove(guild);
	console.log(clc.yellow("[-] Removed from server"));
};
