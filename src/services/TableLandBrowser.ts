import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";
import { Prediction } from "../types";
import { TABLE_NAME, USDC_ASSET_ID } from "../constants";

const KEY = import.meta.env.VITE_KEY;
const providerUrl = import.meta.env.VITE_PUBLIC_INFURA_URL + import.meta.env.VITE_PUBLIC_INFURA_ID;

export class TableLandManager {
  signer: Wallet;
  db: Database<Prediction>;
  constructor() {
    const wallet = new Wallet(KEY);
    const provider = getDefaultProvider(providerUrl);
    this.signer = wallet.connect(provider);
    this.db = new Database<Prediction>({ signer: this.signer });
  }

  generateUUID = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return uuid;
  }

  async read(): Promise<Prediction[]> {
    const { results } = await this.db.prepare(`SELECT * FROM ${TABLE_NAME};`).all<Prediction>();
    return results;
  }

  async insertNotation(notation: string, notation_reason: string) {
    const uuid = this.generateUUID();
    const { meta: insert } = await this.db
      .prepare(`INSERT INTO ${TABLE_NAME} (uuid, asset_id, notation, notation_reason) VALUES (?, ?, ?, ?);`)
      .bind(uuid, USDC_ASSET_ID, notation, notation_reason)
      .run();

    await insert.txn?.wait();
    return insert;
  }

}
