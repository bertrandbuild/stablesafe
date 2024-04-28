import { VOTES_CHAIN_URL } from "../constants";
import { Vote } from "../types";

export function VoteList({ votes }: { votes: Vote[] }) {
  if (!votes || votes.length === 0) {
    return <p>No vote yet</p>;
  }

  return (
    <>
      {votes && (
        <div>
          <h2>Vote history</h2>
          {votes.map((vote, index) => (
            <div className="list-elm" key={index}>
              <span className="row">
                <h3>Risk score :</h3> {vote.notation}/5
              </span>
              <span className="row">
                <h3>Reason :</h3> {vote.notation_reason}
              </span>
            </div>
          ))}
          <p>
            All votes are stored on chain by permissionned voters:{" "}
            <a target="_blank" href={VOTES_CHAIN_URL}>
              see votes
            </a>
          </p>
          <p>
            <a href="./admin">Add a vote</a>
          </p>
        </div>
      )}
    </>
  );
}
