export default class extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EventException";
	}
}
