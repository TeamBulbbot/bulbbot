const CreateGuild = require("./CreateGuild");
const DeleteGuild = require("./DeleteGuild")
const sequelize = require("../database/connection");

module.exports = {
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
    async reloadGuild(guild){
        await DeleteGuild(guild.id)
        await CreateGuild(guild)
    }
}