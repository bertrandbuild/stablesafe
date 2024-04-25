import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { IExecDataProtector } from "@iexec/dataprotector";
import { Contact, IExecWeb3mail } from "@iexec/web3mail";

const ADMIN_USER_ADDRESS = "0x754edfB906252B304f89c59c61f4368028bdcE6c";
const WEB3MAIL_APP_ADDRESS = "0x781482C39CcE25546583EaC4957Fb7Bf04C277D2";
const EXPLORER_URL = "https://explorer.iex.ec/bellecour/dataset/";

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

async function initWeb3mail() {
  const web3Provider = getProvider();
  return new IExecWeb3mail(web3Provider);
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

function ClientList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<Contact[]>();

  const fetchClient = async () => {
    setLoading(true);
    const web3mail = await initWeb3mail();
    if (!web3mail) {
      throw new Error("Web3mail is not available.");
    }
    const contactsList = await web3mail.fetchMyContacts();
    console.log("contactsList", contactsList);
    setClients(contactsList);
    setLoading(false);
  };

  const sendEmail = async (protectedAddress: string) => {
    const web3mail = await initWeb3mail();
    if (!web3mail) {
      throw new Error("Web3mail is not available.");
    }

    await web3mail.sendEmail({
      protectedData: protectedAddress,
      emailSubject: "Depeg Alert - USDC is falling",
      emailContent: "The usdc price is de-pegging. Please check the price on the website.",
      contentType: "text/html",
      senderName: "Depeg Alert team"
    });
    console.log("sendEmail", sendEmail);
  } 

  useEffect(() => {
    fetchClient();
  }, []);

  return (
    <div>
      <button onClick={fetchClient}>Fetch Clients</button>
      {loading && <p>loading</p>}
      {clients && (
        <div>
          <h4>My Contacts</h4>
          {clients.map((client) => (
            <div key={client.address}>
              <h5>{client.address}</h5>
              <button onClick={() => sendEmail(client.address)}>Send Email</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const isAdmin = true;
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Depeg Alert</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <SignUpComponent />
      {isAdmin && 
      <><h2>Admin</h2>
        <ClientList />
      </>
      }
    </>
  );
}

export default App;
