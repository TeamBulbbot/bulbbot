const mongoose = require("mongoose");
const clc = require("cli-color");

const CommandAnalytics = require("../../models/commandAnalytics");

module.exports = {
	CommandAnalyticsHandler: (commandName) => {
		CommandAnalytics.findOne({ commandName: commandName }, (err, res) => {
			if (err) console.error(clc.red(err));
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
	commandAnalytics.save().catch((err) => console.error(clc.red(err)));
}

function IncrementCommand(commandName) {
	CommandAnalytics.findOneAndUpdate(
		{ commandName: commandName },
		{ $inc: { uses: 1 } },
		{ new: true },
		function (err, _res) {
			if (err) console.error(clc.red(err));
		}
	);
}
