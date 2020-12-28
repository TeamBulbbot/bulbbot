const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("GuildOverrideCommands", {
		Enabled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		CommandName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ClearanceLevel: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});
};
