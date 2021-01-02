const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("guildConfiguration", {
		prefix: {
			type: DataTypes.STRING,
			defaultValue: "!",
		},
		trackAnalytics: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		language: {
			type: DataTypes.STRING,
			defaultValue: "en-US",
		},
		muteRole: {
			type: DataTypes.STRING,
		},
	});
};
