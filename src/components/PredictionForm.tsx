import { useState } from "react";
import {
  addPrediction,
  addStakedPrediction,
} from "../services/DymensionPredictions";

export function PredictionForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const submitPrediction = async (notation: string, notationReason: string) => {
    setLoading(true);
    const prediction = await addPrediction({
      date: new Date().getTime(),
      assetId: 1,
      notation: Number(notation),
      notationReason,
    });
    console.log("prediction : ", prediction);
    setIsSubmitted(true);
    setLoading(false);
  };
  const submitStakedPrediction = async (
    notation: string,
    notationReason: string,
    stake: string
  ) => {
    setLoading(true);
    console.log("notation", notation);
    console.log("notationReason", notationReason);
    console.log("stake", stake);
    const prediction = await addStakedPrediction({
      date: new Date().getTime(),
      assetId: 1,
      notation: Number(notation),
      notationReason,
      stake,
    });
    console.log("staked prediction : ", prediction);
    setIsSubmitted(true);
    setLoading(false);
  };
  return (
    <>
      <h2>Add a prediction</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const notation = formData.get("notation") as string;
          const notationReason = formData.get("notationReason") as string;
          console.log("notation", notation);
          console.log("notationReason", notationReason);
          const stake = formData.get("stake") as string;
          console.log("stake", stake);
          if (stake) {
            submitStakedPrediction(notation, notationReason, stake);
          } else {
            submitPrediction(notation, notationReason);
          }
        }}
        className="vote-form"
        autoComplete="off"
        noValidate
      >
        <div className="form-group">
          {isSubmitted && (
            <div className="alert alert-success" role="alert">
              <p>Your prediction has been submitted!</p>
              <p>In case of a staked prediction, an email has been sent to every users</p>
            </div>
          )}
          {!isSubmitted && (
            <>
              <div className="row">
                <div className="col" style={{ marginRight: "30px" }}>
                  <label htmlFor="notation">Notation</label>
                  <input type="number" name="notation" id="notation" required />
                </div>
                <div className="col">
                  <label htmlFor="stake">Stake amount</label>
                  <input type="number" name="stake" id="stake" required />
                </div>
              </div>
              <div className="stake-info" style={{ fontSize: "13px", marginBottom: "50px" }}>
                staked predictions notify users and are eligibe for rewards
              </div>
              <label htmlFor="notationReason">Notation reason</label>
              <textarea name="notationReason" id="notationReason" required />
              <button type="submit" disabled={loading}>
                Submit
                {loading && <span className="spinner" />}
              </button>
            </>
          )}
          {loading && (
            <div className="alert alert-info" role="alert">
              Submitting your prediction...
            </div>
          )}
        </div>
      </form>
    </>
  );
}
