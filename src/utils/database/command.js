const mongoose = require("mongoose");

const CommandAnalytics = require("../../models/commandAnalytics");
const Logger = require("../../utils/other/winston");

module.exports = {
	CommandAnalyticsHandler: (commandName) => {
		CommandAnalytics.findOne({ commandName: commandName }, (err, res) => {
			if (err) Logger.error(err);
			if (res === null) AddCommand(commandName);
			else IncrementCommand(commandName);
		});
	},
};

function AddCommand(commandName) {
	const commandAnalytics = new CommandAnalytics({
		_id: mongoose.Types.ObjectId(),
		commandName: commandName,
		uses: 1,
	});
	commandAnalytics.save().catch((err) => Logger.error(err));
}

function IncrementCommand(commandName) {
	CommandAnalytics.findOneAndUpdate(
		{ commandName: commandName },
		{ $inc: { uses: 1 } },
		{ new: true },
		function (err, _res) {
			if (err) Logger.error(err);
		}
	);
}
