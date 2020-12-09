class PermissionException extends Error {
    constructor(message) {
        super(message);
        this.name = "PermissionException"
    }
}

module.exports = {
    PermissionException
}