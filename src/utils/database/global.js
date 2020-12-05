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

	NumberInfraction: async () => {
		const global = await Global.findOne({}, async (err, _g) => {
			if (err) Logger.error(err);
		});
		return global.infCounter;
	},

	IncrementInfraction: async () => {
		Global.findOneAndUpdate(
			{},
			{ $inc: { infCounter: 1 } },
			{ new: true },
			function (err, _res) {
				if (err) {
					Logger.error(err);
					return false;
				}
			}
		);

		return true;
	},
};
