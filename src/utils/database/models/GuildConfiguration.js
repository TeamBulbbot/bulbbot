const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("guildConfiguration", {
		prefix: {
			type: DataTypes.STRING,
			defaultValue: "!",
			allowNull: false,
		},
		language: {
			type: DataTypes.STRING,
			defaultValue: "en-US",
			allowNull: false,
		},
		timezone: {
			type: DataTypes.STRING,
			defaultValue: "UTC",
			allowNull: false,
		},
		muteRole: {
			type: DataTypes.STRING,
		},
		premiumGuild: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		autorole: {
			type: DataTypes.STRING
		}
	});
};
