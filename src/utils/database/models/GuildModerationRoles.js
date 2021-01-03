const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("guildModerationRoles", {
		roleId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		clearanceLevel: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
