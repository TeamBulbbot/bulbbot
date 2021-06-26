import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define("guildLogging", {
		modAction: {
			type: DataTypes.STRING,
		},
		automod: {
			type: DataTypes.STRING,
		},
		message: {
			type: DataTypes.STRING,
		},
		role: {
			type: DataTypes.STRING,
		},
		member: {
			type: DataTypes.STRING,
		},
		channel: {
			type: DataTypes.STRING,
		},
		joinLeave: {
			type: DataTypes.STRING,
		},
		other: {
			type: DataTypes.STRING,
		},
	});
}
