import { IExecOracleFactory, utils } from "@iexec/iexec-oracle-factory-wrapper";
import 'dotenv/config'

/**
 * Price oracle using iExec
 */
export class IExecOracleManage {
  constructor(chain, coin, vs_currency) {
    this.chain = chain;
    this.coin = coin;
    this.vs_currency = vs_currency;
    this.apiKey = process.env.COIN_GECKO_API_KEY;
    this.oracleCid = process.env.ORACLE_CID;
    const signer = utils.getSignerFromPrivateKey(
      `https://${this.chain}.iex.ec`,
      process.env.ADMIN_WALLET_PRIVATE_KEY
    );
    this.factory = new IExecOracleFactory(signer);
  }

  createOracle() {
    return new Promise((resolve, reject) => {
      this.factory.createOracle({
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${this.coin}&vs_currencies=${this.vs_currency}`,
        method: "GET",
        headers: {
          authorization: "%API_KEY%",
        },
        dataType: "number",
        JSONPath: `$['${this.coin}']['${this.vs_currency}']`,
        apiKey: this.apiKey,
      }).subscribe({
        next: (data) => console.log("next", data),
        error: (error) => {
          console.log("error", error);
          reject(error);
        },
        complete: () => {
          resolve('Creation Completed successfully');
        },
      });
    });
  }

  updateOracle() {
    return new Promise((resolve, reject) => {
      this.factory.updateOracle(this.oracleCid)
        .subscribe({
          next: (data) => console.log("next", data),
          error: (error) => {
            console.log("error", error);
            reject(error);
          },
          complete: (data) => {
            console.log(`Oracle update with function "${context.functionName}" ran at ${new Date()} with task id ${data.taskid}`);
            resolve('Update completed successfully');
          }
        });
    });
  }

  readOracle() {
    return this.factory.readOracle(this.oracleCid)
      .then(readOracleRes => {
        return readOracleRes;
      });
  }
}
