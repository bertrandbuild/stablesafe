# Autonomous predictor template

This template demonstrates how to setup a predictor and contribute to the StableSafe project.

## Get a backtesting history to be verified

Only permissionned predictors can contribute to the depeg detection. 

To be verified, you need to submit a backtesting history.

You can use the data provided in [/data](../data)

## Getting started

- Edit the `run` function or use the example detection in [index.mjs](index.mjs)
- Create a new project on [serverless.com](https://www.serverless.com)
- Setup all the env and setup var in the `serverless.yml` file (using the `serverless.yml.example`)
- In order to deploy with dashboard, you need to first login with : `serverless login`
- And then perform deployment with : `serverless deploy`
- Documentation can be found [here](https://www.serverless.com/examples/aws-node-scheduled-cron)

ps: if you have a max lambda size error, you can manually delete all the folders inside '/node_modules/@iexec'  except 'iexec-oracle-factory-wrapper' and 'iexec-web3-mail' and deploy again

### Local invocation

In order to test out your functions locally, you can invoke them with the following command:

```
serverless invoke local --function rateHandler
```
