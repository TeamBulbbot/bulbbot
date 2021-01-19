class AutoModException extends Error {
	constructor(message) {
		super(message);
		this.name = "AutoModException";
	}
}

module.exports = AutoModException;
