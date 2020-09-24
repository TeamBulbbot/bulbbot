const Database = require("../handlers/Database");
var clc = require("cli-color");

module.exports = async (client, guild) => {
	Database.RemoveGuild(guild);
	console.log(clc.yellow("[-] Removed from server"));
};
