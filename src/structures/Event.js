const {EventException} = require("./exceptions/EventException");

module.exports = class Event {

    constructor(client, name, options = {}) {
        this.name = name;
        this.client = client;
        this.type = options.once ? 'once' : 'on';
        this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
    }

    async run(...args) {
        throw new EventException(`Event ${this.name} doesn't contain a run method!`)
    }

};