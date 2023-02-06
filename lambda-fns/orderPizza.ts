import { ApplicationError } from "./error";
import { IOrder} from "./order";
import { Quantity, Flavour, Flavours } from "./pizza";

exports.handler = async function(order: IOrder) {
    console.log("Requested Pizza :", JSON.stringify(order, undefined, 2));

    const quantity = order?.quantity;
    const flavour = <Flavours>order?.flavour;
    
    if (Quantity.isInvalid(quantity)) {
        throw new ApplicationError(
            ApplicationError.Status.InvalidQuantityError
        );
    }

    if (Flavour.isNotAvailable(flavour)) {
        throw new ApplicationError(
            ApplicationError.Status.NotAvailableFlavourError
        );
    }

    if (Flavour.isInvalid(flavour)) {
        throw new ApplicationError(
            ApplicationError.Status.InvalidFlavourError
        );
    }

    return {
        statusCode: 200,
        body: order
    }
}