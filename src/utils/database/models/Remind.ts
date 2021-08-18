import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define("remind", {
		reason: {
			type: DataTypes.STRING(1500),
			allowNull: false,
		},
		expireTime: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		channelId: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		messageId: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	});
}
