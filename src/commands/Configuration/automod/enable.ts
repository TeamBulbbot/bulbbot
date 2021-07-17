import BulbBotClient from "../../../structures/BulbBotClient";
import { Message, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default async function (client: BulbBotClient, message: Message): Promise<void> {
	await databaseManager.enableAutomod(<Snowflake>message.guild?.id, true);
	await message.channel.send(await client.bulbutils.translateNew("automod_enabled", message.guild?.id, {}));
}