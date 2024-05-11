import { useEffect, useState } from "react";
import "../styles/App.css";
import { Prediction } from "../types.ts";
import { PredictionList } from "../components/PredictionList.tsx";
import { SignUpComponent } from "../components/SignUp.tsx";
import { OraclePriceComponent } from "../components/OraclePrice.tsx";
import { getAllPredictionIds, readPrediction } from "../services/DymensionPredictions.ts";
import { BigNumber, ethers } from "ethers";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

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

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <div>
      <div className="hero">
        <div className="header">
          <span>
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-download.com%2Fwp-content%2Fuploads%2F2022%2F01%2FUSD_Coin_USDC_Logo.png"
              className="logo"
              alt="Vite logo"
            />
          </span>
          <h1>Usdc Status</h1>
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
            <ul>
              {predictions.length > 0 && predictions[predictions.length - 1].notationReason}
            </ul>
          </div>
        </div>
        <SignUpComponent />
      </div>
      <div className="votes">
        {loading && <p>loading</p>}
        <PredictionList votes={predictions} />
      </div>
    </div>
  );
}

export default App;
