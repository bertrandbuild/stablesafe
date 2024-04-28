import serverless from "serverless-http";
import express from 'express';
import { IExecWeb3mailManager } from './services/iExecWeb3mail.mjs';
const app = express();
const mailManager = new IExecWeb3mailManager("bellecour");

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/sendMailToAll", (req, res, next) => {
  mailManager.sendEmailToAllContacts();
  return res.status(200).json({
    message: "Request sent!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
