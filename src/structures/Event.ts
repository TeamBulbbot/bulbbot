import BulbBotClient from "./BulbBotClient";
import EventException from "./exceptions/EventException";

export default class {
    public readonly client: BulbBotClient;
    public readonly name: string;
    public readonly type: string;
    public readonly emitter: any;

    constructor(client: BulbBotClient, name: string, options: any) {
        this.client = client;
        this.name = name;
        this.type = options.type ? "once" : "on";
        this.emitter = (typeof options.emitter === "string" ? this.client[options.emitter] : options.emitter) || this.client;
    }

    public async run(...args: any) {
        throw new EventException(`Event ${this.name} doesn't contain a run method!`)
    }
}
