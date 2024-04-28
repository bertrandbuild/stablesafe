import { useState, useEffect } from "react";
import { IExecOracleManager } from "../services/iExecOracleBrowserReader.ts";
import { ORACLE_CID } from "../constants.ts";

export function OraclePriceComponent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [usdcPrice, setUsdcPrice] = useState<number>();
  const [error, setError] = useState<string>("");

  async function getUsdcPrice(): Promise<number> {
    const oracleUsdc = new IExecOracleManager(
      "bellecour",
      ORACLE_CID
    );
    const oraclePrice = await oracleUsdc.readOracle();
    return Number(oraclePrice.value);
  }
  useEffect(() => {
    setLoading(true);
    getUsdcPrice()
      .then((price) => {
        setUsdcPrice(price);
        setLoading(false);
      })
      .catch((error: unknown) => {
        setLoading(false);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          throw new Error("An unexpected error occurred.");
        }
      });
  }, []);

  return (
    <>
      {usdcPrice && <h1>{usdcPrice}</h1>}
      {loading && <p>loading</p>}
      {error && <p>Error: {error}</p>}
    </>
  );
}