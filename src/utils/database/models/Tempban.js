const {DataTypes} = require("sequelize");

module.exports = sequelize => {
    sequelize.define("Tempban", {
        TargetTag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        TargetId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ExpireTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    });
};
