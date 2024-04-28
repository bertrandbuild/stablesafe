import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";
import { Vote } from "../types";

const KEY = import.meta.env.VITE_KEY;
const TABLE_NAME = 'vote_op_sepolia_11155420_54';
const USDC_ASSET_ID = 1;

export class TableLandManager {
  signer: Wallet;
  db: Database<Vote>;
  constructor() {
    const wallet = new Wallet(KEY as string);
    const provider = getDefaultProvider(import.meta.env.VITE_PUBLIC_INFURA_URL as string + import.meta.env.VITE_PUBLIC_INFURA_ID as string);
    this.signer = wallet.connect(provider);
    this.db = new Database<Vote>({ signer: this.signer });
  }

  generateUUID = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return uuid;
  }

  async read(): Promise<Vote[]> {
    const { results } = await this.db.prepare(`SELECT * FROM ${TABLE_NAME};`).all<Vote>();
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