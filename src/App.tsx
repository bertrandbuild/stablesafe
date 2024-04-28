import { useState } from "react";
import "./App.css";
import { IExecDataProtector } from "@iexec/dataprotector";

const ADMIN_USER_ADDRESS = "0x754edfB906252B304f89c59c61f4368028bdcE6c";
const WEB3MAIL_APP_ADDRESS = "0x781482C39CcE25546583EaC4957Fb7Bf04C277D2";
const EXPLORER_URL = "https://explorer.iex.ec/bellecour/dataset/";

type VoteT = {
  notation: number,
  notation_reason: string
}

const data: VoteT[] = [{
  notation: 1,
  notation_reason: "stable environment"
}, {
  notation: 3,
  notation_reason: "a depeg has been detected"
}]

const getProvider = () => {
  const web3Provider = window.ethereum;
  if (!web3Provider) {
    throw new Error("No web3 provider available.");
  }
  return web3Provider;
};

async function initDataProtector() {
  const web3Provider = getProvider();
  return new IExecDataProtector(web3Provider);
}

// Signup : Protect email and grant access to web3mail app
async function signup(email: string): Promise<string> {
  console.log("Signing up :", email);
  const dataProtector = await initDataProtector();
  if (!dataProtector) {
    throw new Error("Data protector is not available.");
  }

  try {
    const protectedData = await dataProtector.protectData({ data: { email } });
    console.log("Protected Data:", protectedData);

    const grantedAccess = await dataProtector.grantAccess({
      protectedData: protectedData.address,
      authorizedApp: WEB3MAIL_APP_ADDRESS,
      authorizedUser: ADMIN_USER_ADDRESS,
      pricePerAccess: 0,
      numberOfAccess: 100000000000000,
    });
    console.log("Access Granted:", grantedAccess);

    return protectedData.address;
  } catch (error) {
    throw new Error("Signup process failed: " + error);
  }
}

function SignUpComponent() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultTxHash, setResultTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const signupResult = await signup(email);
      setResultTxHash(signupResult);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        throw new Error(
          "An unexpected error occurred during the signup process."
        );
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={handleSignUp}>Sign Up</button>
      {loading && <p>loading</p>}
      {error && <p>Error: {error}</p>}
      {resultTxHash && (
        <div>
          <h4>Private Signup Successful</h4>
          <p>
            You can check the transaction proof on the {" "}
            <a target="_blank" href={EXPLORER_URL + resultTxHash}>iExec chain explorer</a>
          </p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <div className="header">
        <span>
          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-download.com%2Fwp-content%2Fuploads%2F2022%2F01%2FUSD_Coin_USDC_Logo.png" className="logo" alt="Vite logo" />
        </span>
        <h1>Usdc Status</h1>
      </div>
      <div className="grid">
        <div className="w50">
          <h2>Risk score</h2>
          <span className="risk-level">
            <h1>{data.reduce((sum, newVal) => sum + newVal.notation, 0) / data.length}</h1>
            <h3>/5</h3>
          </span>
        </div>
        <div className="w50">
          <h2>Summary</h2>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item.notation_reason}</li>
            ))}
          </ul>
          <p><a href="./admin">Add a vote</a></p>
        </div>
      </div>
      <p className="read-the-docs">
        Be notified if a risk appears
      </p>
      <SignUpComponent />
    </>
  );
}

export default App;
