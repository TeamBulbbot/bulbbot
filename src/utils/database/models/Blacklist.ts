import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define("blacklist", {
		isGuild: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		snowflakeId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		reason: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		developerId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
}
