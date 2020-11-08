const lang = require("../../responses.json")

module.exports = {
    Translate: (key, {uptime, emote_warn, emote_tools, emote_success, role, guild} = {}) => {
        let response = JSON.parse(JSON.stringify(lang))[key];
        //Uptime
        response = response.toString().replace(/({uptime})/g, uptime);

        //Discord variables
        response = response.toString().replace(/({role})/g, role);
        response = response.toString().replace(/({guild})/g, guild);

        //Emotes
        response = response.toString().replace(/({emote_warn})/g, emote_warn);
        response = response.toString().replace(/({emote_tools})/g, emote_tools);
        response = response.toString().replace(/({emote_success})/g, emote_success);
        return response;
    }
}