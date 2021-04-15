class TranslatorException extends Error {
	constructor(...args) {
		super(...args);
		this.name = "TranslatorException";

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if(Error.captureStackTrace) {
			Error.captureStackTrace(this, TranslatorException)
		}
	}
}

module.exports = {
	TranslatorException,
};
