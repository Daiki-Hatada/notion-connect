export class IgnorableError extends Error {
    override readonly name = "ValidationError" as const
    constructor(message: string, options?: ErrorOptions) {
        super(message, options)
    }
}
