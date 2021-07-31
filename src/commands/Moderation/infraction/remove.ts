import SubCommand from "../../../structures/SubCommand";
import { Message, Snowflake } from "discord.js";
import Command from "../../../structures/Command";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import * as Emotes from "../../../emotes.json";
import { NonDigits } from "../../../utils/Regex";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "delete",
			aliases: ["del", "remove"],
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["infraction:int"],
			usage: "!inf delete <infraction>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		const infID: number = Number(args[1]);

		if (isNaN(infID) || (await infractionsManager.getInfraction(<Snowflake>message.guild?.id, infID)) === undefined) {
			return message.channel.send(
				await this.client.bulbutils.translate("infraction_not_found", message.guild?.id, {
					infractionId: args[1],
				}),
			);
		}

		const inf: Record<string, any> = <Record<string, any>>await infractionsManager.getInfraction(<Snowflake>message.guild?.id, infID);
		let confirmMsg: Message;

		await message.channel
			.send(
				await this.client.bulbutils.translate("infraction_delete_confirm", message.guild?.id, {
					infractionId: inf["id"],
					moderator_tag: inf["moderator"],
					moderator_id: inf["moderatorId"],
					user_tag: inf["target"],
					user_id: inf["targetId"],
					reason: inf["reason"],
				}),
			)
			.then(msg => {
				confirmMsg = msg;
				msg.react(Emotes.other.SUCCESS);
				msg.react(Emotes.other.FAIL);

				const filter = (reaction, user) => {
					return user.id === message.author.id;
				};

				msg
					.awaitReactions(filter, { max: 1, time: 30000, errors: ["time"] })
					.then(async collected => {
						const reaction = collected.first();

						if (reaction?.emoji.id === Emotes.other.SUCCESS.replace(NonDigits, "")) {
							await infractionsManager.deleteInfraction(<Snowflake>message.guild?.id, infID);
							await msg.delete();
							return await message.channel.send(
								await this.client.bulbutils.translate("infraction_delete_success", message.guild?.id, {
									infractionId: infID,
								}),
							);
						} else {
							await msg.delete();
							return await message.channel.send(await this.client.bulbutils.translate("global_execution_cancel", message.guild?.id));
						}
					})
					.catch(async () => {
						await confirmMsg.delete();
						return await message.channel.send(await this.client.bulbutils.translate("global_execution_cancel", message.guild?.id));
					});
			});
	}
}
