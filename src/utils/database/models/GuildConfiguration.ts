import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define("guildConfiguration", {
		prefix: {
			type: DataTypes.STRING,
			defaultValue: "!",
			allowNull: false,
		},
		language: {
			type: DataTypes.STRING,
			defaultValue: "en-US",
			allowNull: false,
		},
		timezone: {
			type: DataTypes.STRING,
			defaultValue: "UTC",
			allowNull: false,
		},
		premiumGuild: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		autorole: {
			type: DataTypes.STRING,
		},
		actionsOnInfo: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		rolesOnLeave: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		manualNicknameInf: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		quickReasons: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			defaultValue: ["Spam", "Swearing", "Toxic behavior", "Advertising"],
		},
	});
}
