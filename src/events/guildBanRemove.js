const Log = require("../utils/moderation/log");
const Translator = require("../utils/lang/translator")
const Moderation = require("../utils/moderation/moderation")

module.exports = async (client, guild, user) => {
    const log = await guild.fetchAuditLogs({limit: 1, type: 'MEMBER_BAN_REMOVE'});
    const banLog = log.entries.first();
    const { executor } = banLog;
    if (executor.id === client.user.id) return;

    await Log.Mod_action(
        client,
        guild.id,
        Translator.Translate("event_guild_ban_remove",
            {
                user: user.username,
                user_discriminator: user.discriminator,
                user_id: user.id,
                moderator: executor.username,
                moderator_discriminator: executor.discriminator,
                moderator_id: executor.id,
            }),
        ""
    )

    await Moderation.Unban(client, guild.id, user.id, executor.id, "Manual Unban")
}