export enum AvailableFlavours {
    Cheese = "cheese",
    Pepperoni = "pepperoni",
    Veggie = "veggie",
    Margherita = "margherita"
};

export enum NotAvailableFlavours {
    Pinneapple = "pineapple",
    Hawaiian = "hawaiian",
};

export type Flavours = AvailableFlavours | NotAvailableFlavours;

export class Flavour {
    public static isNotAvailable(value: string | undefined | null): boolean {
        if (!value) return false;

        return (
            Object.values(NotAvailableFlavours).indexOf(<NotAvailableFlavours>value
            ) === -1
        ) ? false : true;
    }
}