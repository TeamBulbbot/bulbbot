import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define("banpools", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
}
