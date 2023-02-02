import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import TheStateMachine = require('../lib/the-state-machine-stack');

test('API Gateway Proxy Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new TheStateMachine.TheStateMachineStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::ApiGatewayV2::Integration", {
    "IntegrationType": "AWS_PROXY",
    "ConnectionType": "INTERNET",
    "IntegrationSubtype": "StepFunctions-StartSyncExecution",
    "PayloadFormatVersion": "1.0",
    "RequestParameters": {
        "Input": "$request.body",
        "StateMachineArn": {
        }
    },
    "TimeoutInMillis": 10000
  }
  ));
});


test('State Machine Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new TheStateMachine.TheStateMachineStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::StepFunctions::StateMachine", {
    "DefinitionString": {
      "Fn::Join": [
        "",
        [
          "{\"StartAt\":\"Order Pizza Job\",\"States\":{\"Order Pizza Job\":{\"Next\":\"Cook Pizza Job\",\"Retry\":[{\"ErrorEquals\":[\"Lambda.ServiceException\",\"Lambda.AWSLambdaException\",\"Lambda.SdkClientException\"],\"IntervalSeconds\":2,\"MaxAttempts\":6,\"BackoffRate\":2}],\"Catch\":[{\"ErrorEquals\":[\"NotAvailableFlavourError\"],\"Next\":\"Unavailable Flavour Selected\"}],\"Type\":\"Task\",\"InputPath\":\"$\",\"ResultPath\":\"$.order\",\"Resource\":\"",
          {
            "Fn::GetAtt": [
              "orderPizzaLambdaHandler58F6696E",
              "Arn"
            ]
          },
          "\"},\"Cook Pizza Job\":{\"Next\":\"Failed\",\"Retry\":[{\"ErrorEquals\":[\"Lambda.ServiceException\",\"Lambda.AWSLambdaException\",\"Lambda.SdkClientException\"],\"IntervalSeconds\":2,\"MaxAttempts\":6,\"BackoffRate\":2}],\"Type\":\"Task\",\"InputPath\":\"$\",\"ResultPath\":\"$.order\",\"Resource\":\"",
          {
            "Fn::GetAtt": [
              "cookPizzaLambdaHandler1AFD5F5C",
              "Arn"
            ]
          },
          "\"},\"Failed\":{\"Type\":\"Choice\",\"Choices\":[{\"Variable\":\"$.order.failed\",\"BooleanEquals\":true,\"Next\":\"Sorry, Problem Cooking Pizza\"}],\"Default\":\"Deliver your pizza\"},\"Deliver your pizza\":{\"Type\":\"Succeed\",\"OutputPath\":\"$.order\"},\"Sorry, Problem Cooking Pizza\":{\"Type\":\"Fail\",\"Error\":\"Failed To Make Pizza\",\"Cause\":\"Cooking failure\"},\"Unavailable Flavour Selected\":{\"Type\":\"Fail\"}},\"TimeoutSeconds\":300}"
        ]
      ]
    },
    "StateMachineType": "EXPRESS",
    "TracingConfiguration": {
      "Enabled": true
    }
  }
  ));
});

test('Order Pizza Lambda Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new TheStateMachine.TheStateMachineStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::Lambda::Function", {
    "Handler": "orderPizza.handler"
  }
  ));
});

