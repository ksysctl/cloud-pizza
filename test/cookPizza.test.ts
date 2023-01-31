const cookingLambda = require('../lambda-fns/cookPizza');

test('should not fail if valid flavour pizza is given', async () => {
    const event = {
        flavour: 'cheese',
        containsPineapple: false
    };

    const res = await cookingLambda.handler(event);
    expect(res).toBeDefined();

    expect(res).toEqual({
        failed: false,
        flavour: 'cheese',
        containsPineapple: false
    });
});


