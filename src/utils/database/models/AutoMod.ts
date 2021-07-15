import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define(
		"automod",
		{
			enabled: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			websiteWhitelist: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
			punishmentWebsite: {
				type: DataTypes.STRING,
			},
			inviteWhitelist: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
			punishmentInvites: {
				type: DataTypes.STRING,
			},
			wordBlacklist: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
			wordBlacklistToken: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
			punishmentWords: {
				type: DataTypes.STRING,
			},
			limitMentions: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			punishmentMentions: {
				type: DataTypes.STRING,
			},
			timeoutMentions: {
				type: DataTypes.INTEGER,
				defaultValue: 15000,
			},
			limitMessages: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			punishmentMessages: {
				type: DataTypes.STRING,
			},
			timeoutMessages: {
				type: DataTypes.INTEGER,
				defaultValue: 10000,
			},
			ignoreChannels: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
			ignoreRoles: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
			ignoreUsers: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
		},
		{
			timestamps: false,
		},
	);
}
