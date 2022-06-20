import { Snowflake } from "discord.js";
import prisma from "../../prisma";
import { isNullish } from "../helpers";

export default class {
	async addExperimentToGuild(guildId: Snowflake, name: string) {
		return await prisma.experiment.create({
			data: {
				name,
				bulbGuild: {
					connect: {
						guildId,
					},
				},
			},
		});
	}

	public async removeExperimentFromGuild(guildId: Snowflake, name: string) {
		const bulbGuild = await prisma.bulbGuild.findUnique({
			where: {
				guildId,
			},
		});
		if (isNullish(bulbGuild)) {
			throw new Error("could not find a bulbGuild for the guild ID");
		}
		return await prisma.experiment.delete({
			where: {
				bulbGuildId_name: {
					bulbGuildId: bulbGuild.id,
					name,
				},
			},
		});
	}

	public async getAllGuildExperiments(guildId: Snowflake) {
		const result = await prisma.experiment.findMany({
			select: {
				name: true,
			},
			where: {
				bulbGuild: {
					guildId,
				},
			},
		});

		return result.map(({ name }) => name);
	}
}
