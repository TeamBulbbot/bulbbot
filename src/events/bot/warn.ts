import Event from "../../structures/Event";

export default class extends Event {
	constructor(...args: any) {
		// @ts-ignore
        super(...args, {});
	}

	async run(info: string) {
		console.warn("[CLIENT WARN]: ", info);
	}
};
