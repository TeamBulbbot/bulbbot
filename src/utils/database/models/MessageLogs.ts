import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define("messageLog", {
		messageId: {
			type: DataTypes.STRING(18),
			allowNull: false,
			primaryKey: true,
			autoIncrement: false,
		},
		channelId: {
			type: DataTypes.STRING(18),
			allowNull: false,
		},
		authorId: {
			type: DataTypes.STRING(18),
			allowNull: false,
		},
		authorTag: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING(4000),
			allowNull: true,
		},
		embed: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		sticker: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		attachments: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},
	});
}
