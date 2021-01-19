const { DataTypes } = require("sequelize");

module.exports = sequelize => {
    sequelize.define("automod", {
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        inviteWhitelist: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        punishmentInvites: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        wordBlacklist: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        punishmentWords: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        limitMentions: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        punishmentMentions: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        limitMessages: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        punishmentMessages: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
    }, {
        timestamps: false
    })
}