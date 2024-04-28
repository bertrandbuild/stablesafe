import { useEffect, useState } from "react";
import "./App.css";
import { TableLandManager } from "./services/TableLandBrowser.ts";
import { Vote } from "./types.ts";
import { VoteList } from "./components/VoteList.tsx";
import { SignUpComponent } from "./components/SignUp.tsx";
import { OraclePriceComponent } from "./components/OraclePrice.tsx";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [votes, setVotes] = useState<Vote[]>([]);
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
              <h1>{votes.length > 0 && votes[votes.length - 1].notation}</h1>
              <h3>/5</h3>
            </span>
          </div>
          <div className="w50">
            <h2>Summary</h2>
            <ul>
              {votes.length > 0 && votes[votes.length - 1].notation_reason}
            </ul>
          </div>
        </div>
        <p className="read-the-docs">Be notified if a risk appears</p>
        <SignUpComponent />
      </div>
      <div className="votes">
        {loading && <p>loading</p>}
        <VoteList votes={votes} />
      </div>
    </div>
  );
}

export default App;
