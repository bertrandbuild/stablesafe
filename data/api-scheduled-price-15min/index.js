import {updateOracle, readOracle} from './services/iExecUsdcOracle.js';

module.exports.run = async (event, context) => {
  const time = new Date();
  try {
    await updateOracle()
      .then(async () => {
        const {value: newUsdcValue} = await readOracle();
        if (newUsdcValue < 0.994) {
          console.log('Depeg detected');
          // TODO: send web3 mail to other voters
        }
        console.log(`New usdc value: ${newUsdcValue}`);
      })
  } catch (error) {
    console.error(error);
  }
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);
};
