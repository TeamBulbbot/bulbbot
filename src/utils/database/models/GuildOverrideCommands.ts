import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
    sequelize.define("guildOverrideCommands", {
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        commandName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clearanceLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
}