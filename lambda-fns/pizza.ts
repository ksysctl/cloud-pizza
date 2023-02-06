export const QUANTITY_MIN = 1;

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

    public static isInvalid(value: string | undefined | null): boolean {
        if (!value) return true;

        return (
                Object.values(AvailableFlavours).indexOf(<AvailableFlavours>value
            ) === -1
        ) ? true : false;
    }
}

export class Quantity {
    public static isInvalid(value: Number | undefined | null): boolean {
        if (!value || value < QUANTITY_MIN) {
            return true;
        }

        return false;
    }
}