const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("GuildLogging", {
        ModAction: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Role: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Member: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Channel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        JoinLeave: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};
