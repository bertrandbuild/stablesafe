import { IExecOracleManage } from './services/iExecOracle.mjs';
import { IExecWeb3mailManager } from './services/iExecWeb3mail.mjs';
import { TableLandManager } from './services/TableLand.mjs';

const ADMIN_PROTECT_EMAIL = "0xfb85516C8344E803745479D8c834C759F2dE3b52";
const mailManager = new IExecWeb3mailManager("bellecour");
const oracleUsdc = new IExecOracleManage("bellecour", "usd-coin", "usd");
const table = new TableLandManager();

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
      // Send email to other voters to double check
      mailManager.sendEmail(ADMIN_PROTECT_EMAIL);
      // Vote to update the notation
      table.insertNotation(3, `a depeg has been detected at: ${time}, usdec value: ${newUsdcValue}`); 
    }
    console.log(`New usdc value: ${newUsdcValue}`);
  } catch (error) {
    console.error(error);
  }
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);
};
