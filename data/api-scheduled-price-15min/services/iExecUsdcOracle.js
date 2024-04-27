import { IExecOracleFactory, utils } from "@iexec/iexec-oracle-factory-wrapper";
import 'dotenv/config'

// const chainId = 134;
const chain = "bellecour";
const coin = "usd-coin";
const vs_currency = "usd";
const apiKey = process.env.COIN_GECKO_API_KEY;
const oracleCid = process.env.ORACLE_CID;

// get web3 provider from a private key
const signer = utils.getSignerFromPrivateKey(
  `https://${chain}.iex.ec`,
  process.env.ADMIN_WALLET_PRIVATE_KEY
);
const factory = new IExecOracleFactory(signer);

export const createOracle = () => {
  return new Promise((resolve, reject) => {
    factory.createOracle({
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vs_currency}`,
      method: "GET",
      headers: {
        authorization: "%API_KEY%",
      },
      dataType: "number",
      JSONPath: `$['${coin}']['usd']`,
      apiKey: apiKey,
    }).subscribe({
      next: (data) => {
        console.log("next", data);
      },
      error: (error) => {
        console.log("error", error);
        reject(error);
      },
      complete: () => {
        console.log("Oracle Creation Completed");
        resolve('Creation Completed successfully');
      },
    });
  });
}

export const updateOracle = async () => {
  return new Promise((resolve, reject) => {
    factory.updateOracle(oracleCid)
      .subscribe({
        next: (data) => {
          console.log("next", data);
        },
        error: (error) => {
          console.log("error", error);
          reject(error);
        },
        complete: () => {
          console.log("Oracle update Completed");
          resolve('Update completed successfully');
        }
      });
  });
}

export const readOracle = async () => {
  const readOracleRes = await factory.readOracle(oracleCid);
  console.log(readOracleRes);
  return readOracleRes;
}
