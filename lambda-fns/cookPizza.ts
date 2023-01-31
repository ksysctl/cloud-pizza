import { IOrder } from "./order";

exports.handler = async function(order:IOrder) {   
    console.log("Cooking Pizza :");

    let failed = false;
    try {
        // placeholder cooking process
    } catch (error) {
        failed = true;
    }

    return {
        ...order,
        failed
    }
}