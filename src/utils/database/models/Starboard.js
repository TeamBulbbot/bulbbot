const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("Starboard", {
		Enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		ChannelId: {
			type: DataTypes.STRING,
		},
		Emoji: {
			type: DataTypes.STRING,
			defaultValue: ":star:", // ⭐
			allowNull: false,
		},
		MinimumCount: {
			type: DataTypes.INTEGER,
			defaultValue: 5,
			allowNull: false,
		},
	});
};
