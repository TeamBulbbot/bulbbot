const CreateGuild = require("./CreateGuild");
const DeleteGuild = require("./DeleteGuild")
const sequelize = require("../database/connection");

module.exports = {
    /**
     * Fetches the Guild prefix from the database
     *
     * @param guild     Guild ID parsed from the message event
     * @returns Guild prefix
     */
    async getPrefix(guild){
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guild.id},
            include: [{model: sequelize.models.GuildConfiguration}]
        })

        if(dbGuild === null) {
            await CreateGuild(guild)
            return process.env.PREFIX
        }
        return dbGuild.GuildConfiguration.Prefix;
    },
    /**
     * Removed and immediately created a new Guild object in the database
     *
     * @param guild     Specified Guild ID
     * @returns {Promise<void>}
     */
    async reloadGuild(guild){
        await DeleteGuild(guild.id)
        await CreateGuild(guild)
    }
}