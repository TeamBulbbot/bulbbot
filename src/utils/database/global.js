const mongoose = require("mongoose");

const Global = require("../../models/global");
const Logger = require("../../utils/other/winston");

module.exports = {
	Setup: () => {
		const global = new Global({
			infCounter: 0,
			commandsFire: 0,
			totalMessages: 0,
		});
		global.save().catch((err) => Logger.error(err));
	},

	Number: () => {},
};
