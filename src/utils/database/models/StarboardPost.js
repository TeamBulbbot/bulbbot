const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("starboardPost", {
		ogMessageId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
