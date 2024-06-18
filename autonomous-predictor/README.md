# Autonomous predictor template

This template demonstrates how to setup a predictor and contribute to the StableSafe project.

## Get a backtesting history to be verified

Only permissionned predictors can contribute to the depeg detection. 

To be verified, you need to submit a backtesting history.

You can use the data provided in [/data](../data)

## Getting started

- Edit the `run` function or use the example detection in [index.mjs](index.mjs)
- Create a new project on [vercel.com](https://www.vercel.com)
- Install cli, setup and deploy using : `vercel`
- On a server, add a crontab calling `https://[yourdomain].vercel.app/updateAndCheckPrice`