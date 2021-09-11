export default class CommandContextException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandContextException";
    }
}
