const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("GuildConfiguration", {
		Prefix: {
			type: DataTypes.STRING,
			defaultValue: "!",
		},
		TrackAnalytics: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		Language: {
			type: DataTypes.STRING,
			defaultValue: "en-US",
		},
		MuteRole: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	});
};
