const lang = require("../../responses.json")
const Emotes = require("../../emotes.json")

module.exports = {
    Translate: (key, {uptime, role, guild, new_value} = {}) => {
        let response = JSON.parse(JSON.stringify(lang))[key];
        //Uptime
        response = response.toString().replace(/({uptime})/g, uptime);

        //Discord variables
        response = response.toString().replace(/({role})/g, role);
        response = response.toString().replace(/({guild})/g, guild);

        //Emotes
        response = response.toString().replace(/({emote_warn})/g, Emotes.actions.warn);
        response = response.toString().replace(/({emote_tools})/g, Emotes.other.tools);
        response = response.toString().replace(/({emote_success})/g, Emotes.actions.confirm);

        //Configure
        response = response.toString().replace(/({new_value})/g, new_value);
        return response;
    }
}