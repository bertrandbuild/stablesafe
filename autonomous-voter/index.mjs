import { IExecOracleManage } from './services/iExecOracle.mjs';
import { IExecWeb3mailManager } from './services/iExecWeb3mail.mjs';

const ADMIN_PROTECT_EMAIL = "0xfb85516C8344E803745479D8c834C759F2dE3b52";
const mailManager = new IExecWeb3mailManager("bellecour");
const oracleUsdc = new IExecOracleManage("bellecour", "usd-coin", "usd");

export const update = async () => {
  oracleUsdc.updateOracle();
};

export const run = async (event, context) => {
  const time = new Date();
  try {
    // the update oracle has already been started before using the rateHandler
    const { value: newUsdcValue } = await oracleUsdc.readOracle();
    if (newUsdcValue < 0.994) {
      console.log('Depeg detected');
      mailManager.sendEmail(ADMIN_PROTECT_EMAIL);
      // email.sendEmailToAllContacts();
    }
    console.log(`New usdc value: ${newUsdcValue}`);
  } catch (error) {
    console.error(error);
  }
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);
};
