const Global = require("../database/global");
const Infraction = require("../../models/infraction");
const Inf = require("../moderation/infraction");
const Logger = require("../../utils/other/winston");

module.exports = {
	AddInfIdToAllInfraction: async () => {
		const infraction = await Infraction.find({}, async (err, _g) => {
			if (err) Logger.error(err);
		});

		console.log(infraction);

		// Delete all
		Infraction.remove({}, function (err) {
			if (err) console.log(err);
		});

		for (let i = 0; i < infraction.length; i++) {
			await Inf.Add(
				infraction[i].guildID,
				infraction[i].action,
				await Global.NumberInfraction(),
				infraction[i].targetID,
				infraction[i].moderatorID,
				infraction[i].reportReason
			);
			console.log(infraction);
		}
	},
};
