enum Errors { 
    NotAvailableFlavourError = <any>"Flavour not available",
    InvalidFlavourError = <any>"Flavour invalid", 
    InvalidQuantityError = <any>"Invalid quantity", 
    CookingPizzaError = <any>"Error cooking",
    DeliverPizzaError = <any>"Error delivering"
}

export class ApplicationError extends Error {
    static readonly Status = Errors;

    constructor(message: Errors) {
        super(message.toString());

        this.name = Errors[message];
        Object.setPrototypeOf(this, ApplicationError.prototype);
    }
} 