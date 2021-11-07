import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define("banpoolSubscribers", {
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
}
