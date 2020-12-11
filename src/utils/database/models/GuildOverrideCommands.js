const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("GuildOverrideCommands", {
		Enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
		CommandName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ClearanceLevel: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
