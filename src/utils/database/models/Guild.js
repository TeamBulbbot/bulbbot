const {DataTypes} = require("sequelize");

module.exports = sequelize => {
    sequelize.define("Guild", {
        GuildId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};
