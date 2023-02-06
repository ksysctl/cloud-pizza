import { ApplicationError } from "./error";
import { IOrder } from "./order";

exports.handler = async function(event: any) {   
    console.log("Cooking Pizza :");

    let order: IOrder;
    try {
        order = <IOrder>JSON.stringify(event.Payload.body);
    } catch (error) {
        throw new ApplicationError(
            ApplicationError.Status.CookingPizzaError
        );
    }

    return {
        statusCode: 200,
        body: order,
    }
}