const Event = require("../structures/Event")

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    run() {
        console.log([
            `${this.client.user.username} successfully logged and ready`,
            `Listening to ${this.client.commands.size} command(s)`,
            `Listening to ${this.client.events.size} event(s)`
        ].join("\n"))
    }
}