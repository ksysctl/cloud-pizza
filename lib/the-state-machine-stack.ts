import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import apigw = require('@aws-cdk/aws-apigatewayv2');
import sfn = require('@aws-cdk/aws-stepfunctions');
import tasks = require('@aws-cdk/aws-stepfunctions-tasks');
import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';

export class TheStateMachineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Step Function Starts Here
     */
     
    //The first thing we need to do is see if they are asking for pineapple on a pizza
    let orderPizzaLambda = new lambda.Function(this, 'orderPizzaLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda-fns'),
      handler: 'orderPizza.handler'
    });

    //Cook pizza process
    let cookPizzaLambda = new lambda.Function(this, 'cookPizzaLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda-fns'),
      handler: 'cookPizza.handler'
    });


    //deliver pizza process
    let deliverPizzaLambda = new lambda.Function(this, 'deliverPizzaLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda-fns'),
      handler: 'deliverPizza.handler'
    });

    //Create SNS Topic and subcribe lambda
    const deliverTopic = new sns.Topic(this, 'sns-topic-deliver', {
      displayName: 'Deliver SNS Topic',
      
    });

    deliverTopic.addSubscription(
      new subs.LambdaSubscription(deliverPizzaLambda)
    )

    //Notify pizza delivered
    const deliverPizza = new tasks.SnsPublish(this, 'Deliver Pizza Job', {
      topic: deliverTopic,
      message: sfn.TaskInput.fromJsonPathAt('$.Payload.body'),
      resultPath: '$.Sns.Message'
    });

    // Step functions are built up of steps, we need to define our first step
    const orderPizza = new tasks.LambdaInvoke(this, "Order Pizza Job", {
      lambdaFunction: orderPizzaLambda,
      inputPath: '$',
      resultPath: '$'
    })

    //Step cook function
    const cookPizza = new tasks.LambdaInvoke(this, "Cook Pizza Job", {
      lambdaFunction: cookPizzaLambda,
      inputPath: '$',
      resultPath: '$'
    })

    //Pizza Order failure step defined
    const orderFailed = new sfn.Fail(this, 'Order Failed');

    //Pizza Cooking failure step defined
    const cookFailed = new sfn.Fail(this, 'Cook Failed');

    //Pizza Order succeed step defined
    const deliverSucceed = new sfn.Succeed(this, 'Deliver Succeed', {
      inputPath: '$',
      outputPath: '$.Payload',    
    });

    //Express Step function definition
    const definition = sfn.Chain
    .start(orderPizza.addCatch(orderFailed, {
      errors: [
        'NotAvailableFlavourError',
        'InvalidFlavourError',
        'InvalidQuantityError'
      ]
    })) // Capture error if flavour validation failed
    .next(
      cookPizza.addCatch(cookFailed, {
        errors: [
          'CookingPizzaError'
        ]
      })
    )
    .next(deliverPizza)
    .next(deliverSucceed);

    let stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
      timeout: cdk.Duration.minutes(5),
      tracingEnabled: true,
      stateMachineType: sfn.StateMachineType.EXPRESS
    });

    /**
     * HTTP API Definition
     */
    // defines an API Gateway HTTP API resource backed by our step function


    // We need to give our HTTP API permission to invoke our step function
    const httpApiRole = new Role(this, 'HttpApiRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        AllowSFNExec: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['states:StartSyncExecution'],
              effect: Effect.ALLOW,
              resources: [stateMachine.stateMachineArn]
            })
          ]
        })
      }
    })

    const api = new apigw.HttpApi(this, 'the-state-machine-api', {
      createDefaultStage: true,
    });

    // create an AWS_PROXY integration between the HTTP API and our Step Function
    const integ = new apigw.CfnIntegration(this, 'Integ', {
      apiId: api.httpApiId,
      integrationType: 'AWS_PROXY',
      connectionType: 'INTERNET',
      integrationSubtype: 'StepFunctions-StartSyncExecution',
      credentialsArn: httpApiRole.roleArn,
      requestParameters: {
        Input: "$request.body",
        StateMachineArn: stateMachine.stateMachineArn
      },
      payloadFormatVersion: '1.0',
      timeoutInMillis: 10000,
    });

    new apigw.CfnRoute(this, 'DefaultRoute', {
      apiId: api.httpApiId,
      routeKey: apigw.HttpRouteKey.DEFAULT.key,
      target: `integrations/${integ.ref}`,
    });

    // output the URL of the HTTP API
    new cdk.CfnOutput(this, 'HTTP API Url', {
      value: api.url ?? 'Something went wrong with the deploy'
    });
  }
}
