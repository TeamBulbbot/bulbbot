const sequelize = require("../database/connection");
const {UnbanTemp} = require("./actions");

module.exports = {
    TempbanCreate: async (guildId, targetTag, targetId, reason, expireTime) => {
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
        });
        if (dbGuild === null) return;
        const tempban = await sequelize.models.Tempban.create({
            TargetTag: targetTag,
            TargetId: targetId,
            Reason: reason,
            ExpireTime: parseInt(expireTime),
            GuildId: dbGuild.id,
        });

        return tempban.id;
    },
    TempbanDelete: tempbanId => {
        TempBanDel(tempbanId);
    },

    TempbanRestore: async client => {
        const table = await sequelize.models.Guild.findOne({
            where: {},
            include: [{model: sequelize.models.Tempban}],
        });
        if (table === null) return;

        const time = Date.now();

        for (const tb of table.Tempbans) {
            const dbGuild = await sequelize.models.Guild.findOne({
                where: {id: tb.GuildId},
            });
            if (dbGuild === null) continue;

            const target = {
                tag: tb.TargetTag,
                id: tb.TargetId,
            };

            const guild = await client.guilds.cache.get(dbGuild.GuildId);

            if (tb.ExpireTime - time <= 0) {
                try {
                    await UnbanTemp(
                        client,
                        guild,
                        target,
                        client.user,
                        client.bulbutils.translate("global_mod_action_log", {
                            action: "Auto-unbanned",
                            moderator_tag: client.user.tag,
                            moderator_id: client.user.id,
                            target_tag: target.tag,
                            target_id: target.TargetId,
                            reason: tb.Reason,
                        }),
                        tb.Reason,
                    );
                } catch (error) {
                    continue;
                }

                await TempBanDel(tb.id);
            } else {
                setTimeout(async function () {
                    await UnbanTemp(
                        client,
                        guild,
                        target,
                        client.user,
                        client.bulbutils.translate("global_mod_action_log", {
                            action: "Auto-unbanned",
                            moderator_tag: client.user.tag,
                            moderator_id: client.user.id,
                            target_tag: target.tag,
                            target_id: target.TargetId,
                            reason: tb.Reason,
                        }),
                        tb.Reason,
                    );

                    await TempBanDel(tb.id);
                }, tb.ExpireTime - time);
            }
        }
    },
};

async function TempBanDel(tempbanId) {
    const dbGuild = await sequelize.models.Guild.findOne({
        where: {},
        include: [
            {
                model: sequelize.models.Tempban,
                where: {
                    id: tempbanId,
                },
            },
        ],
    });
    if (dbGuild === null) return;

    await dbGuild.Tempbans[0].destroy();
}
