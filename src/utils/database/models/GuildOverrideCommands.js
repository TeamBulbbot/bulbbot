const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("guildOverrideCommands", {
		enabled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		commandName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		clearanceLevel: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});
};
