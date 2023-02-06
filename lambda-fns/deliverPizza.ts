import { ApplicationError } from "./error";
import { IOrder } from "./order";
import { SNSEvent } from 'aws-lambda';

exports.handler = async function(event: SNSEvent) {   
    console.log("Deliver Pizza :");
    
    let order: IOrder;
    try {
        order = <IOrder>JSON.stringify(event.Records[0].Sns.Message);
    } catch (error) {
        throw new ApplicationError(
            ApplicationError.Status.DeliverPizzaError
        );
    }

    return {
        statusCode: 200,
        body: order,
    }
}