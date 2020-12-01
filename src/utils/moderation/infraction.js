const mongoose = require("mongoose");

const Infraction = require("../../models/infraction");
const Global = require("../database/global");
const Logger = require("../../utils/other/winston");

module.exports = {
	// Add a new infraction to the database
	Add: async (guildId, action, infId, targetId, moderatorId, reason) => {
		const inf = new Infraction({
			_id: mongoose.Types.ObjectId(),
			guildID: guildId,
			action: action,
			infID: infId,
			targetID: targetId,
			moderatorID: moderatorId,
			reportReason: reason,
			date: new Date(),
		});
		inf.save().catch((err) => Logger.error(err));

		if (!Global.IncrementInfraction())
			Logger.error("Was unable to store the infraction id");
	},

	Remove: async (id, guildId) => {
		Infraction.findOneAndDelete(
			{
				_id: id,
				guildID: guildId,
			},
			(err, _res) => {
				if (err) Logger.error(err);
			}
		);
	},

	Claim: async (id, guildId, moderatorId) => {
		Infraction.findOneAndUpdate(
			{ _id: id, guildID: guildId },
			{ moderatorID: moderatorId },
			function (err) {
				if (err) Logger.error(err);
			}
		);
	},

	Update: async (id, guildId, reason) => {
		Infraction.findOneAndUpdate(
			{ _id: id, guildID: guildId },
			{ reportReason: reason },
			function (err) {
				if (err) Logger.error(err);
			}
		);
	},
};
