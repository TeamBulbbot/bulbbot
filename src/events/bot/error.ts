import Event from "../../structures/Event";

export default class extends Event {
	constructor(...args: any) {
		// @ts-ignore
        super(...args, {});
	}

	async run(error: Error) {
		console.error("[CLIENT ERROR]: ", error);
	}
};
