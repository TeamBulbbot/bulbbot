class TranslatorException extends Error {
	constructor(message) {
		super(message);
		this.name = "TranslatorException";
	}
}

module.exports = {
	TranslatorException,
};
