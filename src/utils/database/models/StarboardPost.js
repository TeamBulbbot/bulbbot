const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("StarboardPost", {
		OGMessageId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
