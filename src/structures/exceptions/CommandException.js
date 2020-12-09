class CommandException extends Error {
    constructor(message) {
        super(message);
        this.name = "CommandException"
    }
}

module.exports = {
    CommandException
}