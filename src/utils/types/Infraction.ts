export interface Infraction {
	id: number;
	action: string;
	active: string;
	reason: string;
	target: string;
	targetId: string;
	moderator: string;
	moderatorId: string;
	createdAt: string;
	updatedAt: string;
	guildId: number;
}
