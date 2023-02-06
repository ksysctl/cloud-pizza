const assert = require('assert');
const orderLambda = require('../lambda-fns/orderPizza');
const { ApplicationError } = require('../lambda-fns/error');

test('should not fail if valid flavour & qauntity given', async () => {
    const event = {
        flavour: 'cheese',
        quantity: 1,
    };

    const res = await orderLambda.handler(event);
    expect(res).toBeDefined();

    expect(res).toEqual({
        flavour: 'cheese',
        quantity: 1
    });
});

test('should fail if not available flavour given', async () => {
    const event = {
        flavour: 'hawaiian',
        quantity: 1,
    };

    await orderLambda.handler(event).catch((error: any) => {
       expect(error.message).toEqual(ApplicationError.Status.NotAvailableFlavourError);
    });
});

test('should fail if invalid flavour given', async () => {
    const event = {
        flavour: '',
        quantity: 1,
    };

    await orderLambda.handler(event).catch((error: any) => {
        expect(error.message).toEqual(ApplicationError.Status.InvalidFlavourError);
    });
});

test('should fail if invalid quantity given', async () => {
    const event = {
        flavour: 'pepperoni',
        quantity: 0,
    };

    await orderLambda.handler(event).catch((error: any) => {
        expect(error.message).toEqual(ApplicationError.Status.InvalidQuantityError);
    });
});
