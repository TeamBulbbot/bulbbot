const { DataTypes } = require("sequelize");

module.exports = sequelize => {
    sequelize.define("tempmute", {
        targetTag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        targetId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expireTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    });
};
