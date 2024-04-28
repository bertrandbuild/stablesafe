import { IExecOracleReader } from '@iexec/iexec-oracle-factory-wrapper';

/**
 * Price oracle using iExec
 */
export class IExecOracleManager {
  chain: string;
  oracleCid: string;
  reader: IExecOracleReader;
  constructor(chain: string, oracleCid: string) {
    this.chain = chain;
    this.oracleCid = oracleCid;
    this.reader = new IExecOracleReader(this.chain);
  }

  readOracle() {
    return this.reader.readOracle(this.oracleCid)
      .then(readOracleRes => {
        return readOracleRes;
      });
  }
}
