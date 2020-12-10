const lang = require("./../languages/en-US.json")
const {TranslatorException} = require("./../structures/exceptions/TranslatorException")
const Emotes = require("./../emotes.json")

module.exports = {
    translation: any = {
        translate: (string, key = {}) => {
            let response;
            try {
                response = JSON.parse(JSON.stringify(lang))[string].toString();
            } catch (err) {
                throw new TranslatorException(`${string} is not a valid translatable string`)
            }

            response = response.replace(/({latency_bot})/g, key.latency_bot)
            response = response.replace(/({latency_ws})/g, key.latency_ws)

            if (key.user) {
                response = response.replace(/({user_name})/g, key.user.username)
                response = response.replace(/({user_discriminator})/g, key.user.discriminator)
            }

            response = response.replace(/({arg})/g, key.arg)
            response = response.replace(/({arg_expected})/g, key.arg_expected)
            response = response.replace(/({arg_provided})/g, key.arg_provided)
            response = response.replace(/({usage})/g, key.usage)

            response = response.replace(/({emote_warn})/g, Emotes.actions.warn)
            response = response.replace(/({emote_tools})/g, Emotes.other.tools)
            return response;
        },
    }
}