const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("Infraction", {
		Action: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Reason: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Target: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		TargetId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Moderator: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ModeratorId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
