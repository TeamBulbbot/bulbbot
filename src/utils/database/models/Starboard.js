const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("starboard", {
		enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		channelId: {
			type: DataTypes.STRING,
		},
		emoji: {
			type: DataTypes.STRING,
			defaultValue: "2b50", // ⭐
			allowNull: false,
		},
		minimumCount: {
			type: DataTypes.INTEGER,
			defaultValue: 3,
			allowNull: false,
		},
	});
};
