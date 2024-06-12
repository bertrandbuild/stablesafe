import express from 'express';
import { IExecOracleManage } from './services/iExecOracle.mjs';
import { IExecWeb3mailManager } from './services/iExecWeb3mail.mjs';
import { addPrediction } from './services/DymensionPredictions.mjs';

const ADMIN_PROTECT_EMAIL = "0xfb85516C8344E803745479D8c834C759F2dE3b52";
const mailManager = new IExecWeb3mailManager("bellecour");
const oracleUsdc = new IExecOracleManage("bellecour", "usd-coin", "usd");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Allow connections from any origin
  res.header('Access-Control-Allow-Origin', '*');

  // Allow methods and headers for CORS
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle pre-flight requests for CORS
  if (req.method === 'OPTIONS') {
      res.send(200);
  } else {
      next();
  }
});

app.get("/update", async (req, res) => {
 
  const time = new Date().getTime();
  console.log('Time: ', time-time);
  oracleUsdc.updateOracle();

  const newtime = new Date().getTime();
  console.log('Time end: ', time-newtime);

  console.log(`Update ran at ${new Date().getTime()}`);

  return res.status(200).json({
    message: "Oracle started to update!",
  });
});

app.get("/updateAndCheckPrice", async (req, res) => {
  await oracleUsdc.updateOracle(); // start update in bg for next run
  const time = new Date().getTime();
  try {
    // the update oracle has already been started before using the rateHandler
    const { value: newUsdcValue } = await oracleUsdc.readOracle();
    if (newUsdcValue < 0.995) {
      console.log('Depeg detected');
      // Add prediction to update the notation
      await addPrediction({
        date: time,
        assetId: 1,
        notation: 3,
        notationReason: `a potential depeg has been detected at: ${time}, usdc value: ${newUsdcValue}`
        });
      // Send email to other voters to double check
      await mailManager.sendEmail(ADMIN_PROTECT_EMAIL);
    }
    console.log(`New usdc value: ${newUsdcValue}`);
    return res.status(200).json({
      message: `New usdc value: ${newUsdcValue}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// Uncomment to test in local
app.listen('3000', () => {
  console.log(`Server is running at http://localhost:3000`);
});
