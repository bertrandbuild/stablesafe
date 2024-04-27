import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";
import 'dotenv/config'

// Connect to provider with a private key (e.g., via Hardhat)
const PRIVATE_KEY = process.env.ADMIN_WALLET_PRIVATE_KEY;
const TABLE_NAME = 'vote_op_sepolia_11155420_54';
const USDC_ASSET_ID = 1;

export class TableLandManager {
  constructor() {
    const wallet = new Wallet(PRIVATE_KEY);
    const provider = getDefaultProvider(process.env.NEXT_PUBLIC_INFURA_URL + process.env.NEXT_PUBLIC_INFURA_ID);
    this.signer = wallet.connect(provider);
    this.db = new Database({ signer: this.signer });
  }

  generateUUID = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return uuid;
  }

  async read() {
    const { results } = await this.db.prepare(`SELECT * FROM '${TABLE_NAME}';`).all();
    return results;
  }

  async insertNotation(notation, notation_reason) {
    const uuid = this.generateUUID();
    const { meta: insert } = await this.db
      .prepare(`INSERT INTO ${TABLE_NAME} (uuid, asset_id, notation, notation_reason) VALUES (?, ?, ?, ?);`)
      .bind(uuid, USDC_ASSET_ID, notation, notation_reason)
      .run();

    await insert.txn?.wait();
    return insert;
  }

}
