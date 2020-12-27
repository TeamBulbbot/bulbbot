const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("Tempban", {
		TargetId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Duration: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});
};
