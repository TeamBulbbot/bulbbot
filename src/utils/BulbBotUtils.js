const lang = require("./../languages/en-US.json")
const {TranslatorException} = require("./../structures/exceptions/TranslatorException")

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
            return response;
        },
    }
}