import { Snowflake } from "discord.js";
import prisma from "../../prisma";
import { paginate } from "../helpers";

export default class {
	public async createReminder(reason: string, expireTime: number, userId: Snowflake, channelId: Snowflake, messageId: Snowflake) {
		return await prisma.reminder.create({
			data: {
				reason,
				expireTime,
				userId,
				channelId,
				messageId,
			},
		});
	}

	public async getReminder(id: number): Promise<any> {
		// TODO: This really could be inlined
		return await prisma.reminder.findUnique({
			where: {
				id,
			},
		});
	}

	public async deleteUserReminder(id: number, userId: Snowflake) {
		const reminder = await prisma.reminder.findUnique({
			where: {
				id,
			},
		});

		// Ensure the reminder belongs to the correct user
		if (reminder?.userId !== userId) {
			return false;
		}

		return this.deleteReminder(id);
	}

	public async deleteReminder(id: number) {
		return await prisma.reminder.delete({
			where: {
				id,
			},
		});
	}
	public async listUserReminders({ userId, ...args }: { userId: string } & Paginatetable) {
		return prisma.reminder.findMany({
			where: {
				userId,
			},
			...paginate(args),
		});
	}

	public async getAllReminders() {
		// TODO: This should be inlined
		return await prisma.reminder.findMany();
	}
}
