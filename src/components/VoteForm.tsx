import { useState } from "react";
import { TableLandManager } from "../services/TableLandBrowser";

export function VoteForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const tableLand = new TableLandManager();
  const submitVote = async (notation: string, notationReason: string) => {
    setLoading(true);
    const vote = await tableLand.insertNotation(notation, notationReason);
    console.log("vote", vote);
    setIsSubmitted(true);
    setLoading(false);
  };
  return (
    <>
      <h2>Vote</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const notation = formData.get("notation") as string;
          const notationReason = formData.get("notationReason") as string;
          console.log("notation", notation);
          console.log("notationReason", notationReason);
          submitVote(notation, notationReason);
        }}
        className="vote-form"
        autoComplete="off"
        noValidate
      >
        <div className="form-group">
          {isSubmitted && (
            <div className="alert alert-success" role="alert">
              Your vote has been submitted!
            </div>
          )}
          {!isSubmitted && (
            <>
              <label htmlFor="notation">Notation</label>
              <input type="number" name="notation" id="notation" required />
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
              Submitting your vote...
            </div>
          )}
        </div>
      </form>
    </>
  );
}
