const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	sequelize.define("guildConfiguration", {
		prefix: {
			type: DataTypes.STRING,
			defaultValue: "!",
		},
		language: {
			type: DataTypes.STRING,
			defaultValue: "en-US",
		},
		muteRole: {
			type: DataTypes.STRING,
		},
	});
};
