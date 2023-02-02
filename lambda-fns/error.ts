enum Errors { 
    NotAvailableFlavourError = <any>"Flavour not available", 
    CookingPizzaError = <any>"Error cooking pizza"
}

export class ApplicationError extends Error {
    static readonly Status = Errors;

    constructor(message: Errors) {
        super(message.toString());

        this.name = Errors[message];
        Object.setPrototypeOf(this, ApplicationError.prototype);
    }
} 