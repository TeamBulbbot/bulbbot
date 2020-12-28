const {DataTypes} = require("sequelize");

module.exports = sequelize => {
    sequelize.define("Starboard", {
        Enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        ChannelId: {
            type: DataTypes.STRING,
        },
        Emoji: {
            type: DataTypes.STRING,
            defaultValue: "2b50", // ⭐
            allowNull: false,
        },
        MinimumCount: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
            allowNull: false,
        },
    });
};
