import { IOrder} from "./order";
import { Flavours } from "./pizza";

exports.handler = async function(order:IOrder) {
    console.log("Requested Pizza :", JSON.stringify(order, undefined, 2));
     
    let containsPineapple = (
        order?.flavour == Flavours.Pinneapple || order?.flavour == Flavours.Hawaiian
    ) ? true : false;

    return {
        ...order,
        containsPineapple
    }
}