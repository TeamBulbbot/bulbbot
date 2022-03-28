import { GuildAuditLogs, GuildScheduledEvent, Permissions } from 'discord.js';
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
    constructor(...args: any[]) {
        // @ts-ignore
        super(...args, {});
    }

    async run(scheduledEvent: GuildScheduledEvent) {
        if(!scheduledEvent.guild?.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

        let msg: string = "";
        const logs: GuildAuditLogs<"GUILD_SCHEDULED_EVENT_CREATE"> = await scheduledEvent.guild?.fetchAuditLogs({ limit: 1, type: "GUILD_SCHEDULED_EVENT_CREATE" });
        const first = logs.entries.first();
        if(!first) return;

        const { executor, createdTimestamp } = first;
        const doesIncludeStartAndEnd = scheduledEvent.scheduledStartTimestamp && scheduledEvent.scheduledEndTimestamp;
        const doesIncludeDescription = scheduledEvent.description;
        const doesIncludeBoth = scheduledEvent.scheduledStartTimestamp && scheduledEvent.scheduledEndTimestamp && scheduledEvent.description;

        if(Date.now() < createdTimestamp + 3000) {
            msg = await this.client.bulbutils.translate(
                doesIncludeBoth ? "event_guild_scheduled_event_create_moderator_both" : doesIncludeStartAndEnd
                ? "event_guild_scheduled_event_create_moderator_timestamp" : doesIncludeDescription
                ? "event_guild_scheduled_event_create_moderator_description" : "event_guild_scheduled_event_create_moderator_none",
                scheduledEvent.guild?.id,
                { scheduledEvent, moderator: executor! },
            );
        }

        if(!msg) {
            msg = await this.client.bulbutils.translate(
                doesIncludeBoth ? "event_guild_scheduled_event_create_both" : doesIncludeStartAndEnd
                ? "event_guild_scheduled_event_create_timestamp" : doesIncludeDescription
                ? "event_guild_scheduled_event_create_description" : "event_guild_scheduled_event_create_none",
                scheduledEvent.guild?.id,
                { scheduledEvent }
            );
        }

        await loggingManager.sendEventLog(this.client, scheduledEvent.guild!, "other", msg);
    }
}
