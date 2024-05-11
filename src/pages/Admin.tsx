import { useEffect, useState } from "react";
import "../styles/App.css";
import { OraclePriceComponent } from "../components/OraclePrice";
import { Prediction } from "../types";
import { ClientList } from "../components/ClientList";
import { VoteForm } from "../components/VoteForm";
import { getAllPredictionIds, isWhitelisted, readPrediction } from "../services/DymensionPredictions";
import { BigNumber, ethers } from "ethers";

function Admin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isWhitelist, setIsWhitelist] = useState<boolean>(false);

  const fetchPredictions = async () => {
    setLoading(true);
    const predictionIds = await getAllPredictionIds();
    const predictions = await Promise.all(
      predictionIds.map(async (predictionIdBN: BigNumber) => {
        const predictionId = ethers.BigNumber.from(predictionIdBN._hex).toNumber();
        const prediction = await readPrediction(predictionId);
        return prediction;
      })
    );
    setPredictions(predictions);
    setLoading(false);
  };

  const init = async() => {
    fetchPredictions();
    const whitelist = await isWhitelisted();
    setIsWhitelist(whitelist);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="header">
        <span>
          <img
            src="https://logos-download.com/wp-content/uploads/2022/01/USD_Coin_USDC_Logo.png"
            className="logo"
            alt="Vite logo"
          />
        </span>
        <h1>Admin</h1>
      </div>
      <div className="grid">
        <div className="w50">
          <h2>Oracle Price</h2>
          <span className="risk-level">
            <OraclePriceComponent />
            <h3>$</h3>
          </span>
        </div>
        <div className="w50">
          <h2>Risk score</h2>
          <span className="risk-level">
            <h1>{predictions.length > 0 && predictions[predictions.length - 1].notation}</h1>
            <h3>/5</h3>
          </span>
        </div>
        <div className="w50">
          <h2>Summary</h2>
          <ul>{predictions.length > 0 && predictions[predictions.length - 1].notationReason}</ul>
        </div>
      </div>
      <div className="votes">
        {loading && <p>loading</p>}
        {isWhitelist && <VoteForm />}
      </div>
      {!isWhitelist && (
        <div>
          <p>
            You are not a verifies predictor.
          </p>
          <p>
            To be whitelisted, submit a community request on the {" "}
            <a href="https://testnet.dymension.xyz/rollapp/rolx_100004-1/governance" target="_blank">
              Dymension governance server
            </a>
            <br />
            Learn more to {" "}
            <a href="https://github.com/bertrandbuild/stablesafe/tree/main/autonomous-voter" target="_blank">
              setup an autonomous predictor.
            </a>
          </p>
        </div>
      )}
      {isWhitelist && (
        <>
          <h2>Subscribers</h2>
          <ClientList />
        </>
      )}
    </>
  );
}

export default Admin;
