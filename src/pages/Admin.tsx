import { useEffect, useState } from "react";
import "../styles/App.css";
import { TableLandManager } from "../services/TableLandBrowser";
import { OraclePriceComponent } from "../components/OraclePrice";
import { Prediction } from "../types";
import { ClientList } from "../components/ClientList";
import { VoteForm } from "../components/VoteForm";

function Admin() {
  const isAdmin = true;
  const [loading, setLoading] = useState<boolean>(false);
  const [votes, setVotes] = useState<Prediction[]>([]);
  const tableLand = new TableLandManager();

  const fetchVotes = async () => {
    setLoading(true);
    const votes = await tableLand.read();
    console.log("votes", votes);
    setVotes(votes);
    setLoading(false);
  };

  useEffect(() => {
    fetchVotes();
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
            <h1>{votes.length > 0 && votes[votes.length - 1].notation}</h1>
            <h3>/5</h3>
          </span>
        </div>
        <div className="w50">
          <h2>Summary</h2>
          <ul>{votes.length > 0 && votes[votes.length - 1].notation_reason}</ul>
        </div>
      </div>
      <div className="votes">
        {loading && <p>loading</p>}
        {isAdmin && <VoteForm />}
      </div>
      {!isAdmin && (
        <div>
          <p>
            You are not allowed to add a vote.
            <br />
            You can{" "}
            <a href="https://x.com/bertrandbuild" target="_blank">
              make a request
            </a>{" "}
            to become a voter.
          </p>
        </div>
      )}
      {isAdmin && (
        <>
          <h2>Subscribers</h2>
          <ClientList />
        </>
      )}
    </>
  );
}

export default Admin;
