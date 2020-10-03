const Database = require("../handlers/Database");
const clc = require("cli-color");

module.exports = async (_client, guild) => {
	Database.RemoveGuild(guild);
	console.log(clc.yellow("[-] Removed from server"));
};
