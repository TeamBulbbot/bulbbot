import { Snowflake, GuildMember } from "discord.js";
import prisma from "../../prisma";

export default class {
	public async createTempBan(target: GuildMember, reason: string, expireTime: number, guildId: Snowflake) {
		return await prisma.tempban.create({
			data: {
				targetId: target.user.id,
				targetTag: target.user.tag,
				reason,
				expireTime,
				guildId,
				bulbGuild: {
					connect: {
						guildId,
					},
				},
			},
		});
	}

	public async getTempBan(id: number) {
		return await prisma.tempban.findUnique({
			where: {
				id,
			},
		});
	}

	public async getLatestTempBan(target: GuildMember, guildId: Snowflake) {
		return await prisma.tempban.findFirst({
			where: {
				targetId: target.user.id,
				bulbGuild: {
					guildId,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	public async deleteTempBan(id: number) {
		return await prisma.tempban.delete({
			where: {
				id,
			},
		});
	}

	public async getAllTemBans() {
		return await prisma.tempban.findMany();
	}
}
