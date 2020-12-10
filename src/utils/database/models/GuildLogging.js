const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("GuildLogging", {
        ModAction: {
            type: DataTypes.STRING,
        },
        Message: {
            type: DataTypes.STRING,
        },
        Role: {
            type: DataTypes.STRING,
        },
        Member: {
            type: DataTypes.STRING,
        },
        Channel: {
            type: DataTypes.STRING,
        },
        JoinLeave: {
            type: DataTypes.STRING,
        },
    });
};
