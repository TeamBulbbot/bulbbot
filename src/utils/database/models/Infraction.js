const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("infraction", {
		action: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		active: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		reason: {
			type: DataTypes.STRING(10000),
			allowNull: false,
		},
		target: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		targetId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		moderator: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		moderatorId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
