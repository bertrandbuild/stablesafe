# Serverless API Oracle Cron using Coingecko, serverless and iExecOracle

This template demonstrates how to develop and deploy a simple cron-like service running on AWS Lambda using the traditional Serverless Framework.

## Serverless setup

- Documentation can be found [here](https://www.serverless.com/examples/aws-node-scheduled-cron)

### Deployment

This example is made to work with the Serverless Framework dashboard, which includes advanced features such as CI/CD, monitoring, metrics, etc.

In order to deploy with dashboard, you need to first login with:

```
serverless login
```

and then perform deployment with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-scheduled-cron-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-scheduled-cron-project-dev (205s)

functions:
  rateHandler: aws-node-scheduled-cron-project-dev-rateHandler (2.9 kB)
  cronHandler: aws-node-scheduled-cron-project-dev-cronHandler (2.9 kB)
```

There is no additional step required. Your defined schedules becomes active right away after deployment.

### Local invocation

In order to test out your functions locally, you can invoke them with the following command:

```
serverless invoke local --function rateHandler
```

After invocation, you should see output similar to:

```bash
Your cron function "aws-node-scheduled-cron-dev-rateHandler" ran at Fri Mar 05 2021 15:14:39 GMT+0100 (Central European Standard Time)
```
