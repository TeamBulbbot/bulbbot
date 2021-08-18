import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
    sequelize.define("guildModerationRoles", {
        /*enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },*/
        roleId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clearanceLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
}