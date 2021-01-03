class EventException extends Error {
	constructor(message) {
		super(message);
		this.name = "EventException";
	}
}

module.exports = {
	EventException,
};
