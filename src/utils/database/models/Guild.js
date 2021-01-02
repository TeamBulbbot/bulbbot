const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("guild", {
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
