import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize): void {
	sequelize.define("experiment", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
}
