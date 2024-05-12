import { useState } from "react";
import { Prediction, StakedPrediction } from "../types";
import { resolvePrediction } from "../services/DymensionPredictions";

export function PredictionList({ predictions }: { predictions: Prediction[] }) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedPrediction, setSlectedPrediction] =
    useState<Prediction | null>(null);
  if (!predictions || predictions.length === 0) {
    return (
      <p>
        No vote yet - <a href="./admin">go to predictor dashboard</a>
      </p>
    );
  }

  // Type guard for StakedPrediction
  function isStakedPrediction(
    prediction: Prediction
  ): prediction is StakedPrediction {
    return (prediction as StakedPrediction).stake !== undefined;
  }

  const VoterPopup = ({ prediction }: { prediction: Prediction | null }) => {
    const [loading, setLoading] = useState<boolean>(false);
    console.log(prediction);
    if (!prediction) {
      return null;
    }
    return (
      <div style={{ display: showPopup ? "block" : "none" }}>
        <div className="background" onClick={() => setShowPopup(false)}></div>
        <div className="popup">
          <h2>Was this notificaton useful ?</h2>
          <p>rated : {prediction?.notation}</p>
          <p>reason : {prediction?.notationReason}</p>
          <div>
            <button
              onClick={async () => {
                setLoading(true);
                await resolvePrediction(Number(prediction.id), true);
                setShowPopup(false);
                setLoading(false);
              }}
              className="btn btn-primary"
            >
              Yes
            </button>
            <button
              onClick={async () => {
                setShowPopup(false);
                await resolvePrediction(Number(prediction.id), false);
                setLoading(false);
                setShowPopup(false);
              }}
              className="btn btn-primary"
            >
              No
            </button>
          </div>
          {loading && <p>Loading...</p>}
        </div>
      </div>
    );
  };

  return (
    <>
      {predictions && (
        <div>
          <h2>Prediction history</h2>
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>Risk score</th>
                <th>Reason</th>
                <th>Stake</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction, index) => (
                <>
                {isStakedPrediction(prediction) ? (
                  <tr
                    key={index}
                    style={
                      prediction.stake && !prediction.isAssessed
                        ? { color: "red" }
                        : {}
                    }
                  >
                    <td>{Number(prediction.id)}</td>
                    <td>{prediction.notation}/5</td>
                    <td>{prediction.notationReason}</td>
                      <>
                        <td>
                          {Number(prediction.stake.toString()) / 10 ** 18} ROLX
                        </td>
                        <td>
                          {prediction.stake && !prediction.isAssessed ? (
                            <button
                              onClick={() => {
                                setSlectedPrediction(prediction);
                                setShowPopup(true);
                              }}
                            >
                              Vote
                            </button>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </>
                  </tr>
                ):(
                  <tr key={index}>
                    <td>{Number(prediction.id)}</td>
                    <td>{prediction.notation}/5</td>
                    <td>{prediction.notationReason}</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                )}
                </>
              ))}
            </tbody>
          </table>
          <VoterPopup prediction={selectedPrediction} />
          <p style={{ marginTop: "50px" }}>
            <a href="./admin">Predictor dashboard</a>
          </p>
        </div>
      )}
    </>
  );
}
