import { ApplicationError } from "./error";
import { IOrder} from "./order";
import { Flavour, Flavours } from "./pizza";

exports.handler = async function(order:IOrder) {
    console.log("Requested Pizza :", JSON.stringify(order, undefined, 2));

    const flavour = <Flavours>order?.flavour;
    if (Flavour.isNotAvailable(flavour)) {
        throw new ApplicationError(
            ApplicationError.Status.NotAvailableFlavourError
        );
    }

    return {
        ...order,
    }
}