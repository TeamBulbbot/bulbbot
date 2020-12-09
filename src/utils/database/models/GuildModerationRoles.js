const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("GuildModerationRoles", {
        RoleId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ClearanceLevel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};