import { useEffect, useState } from "react";
import "./App.css";
import { Contact, IExecWeb3mail } from "@iexec/web3mail";

const ADMIN_USER_ADDRESS = "0x754edfB906252B304f89c59c61f4368028bdcE6c";

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

async function initWeb3mail() {
  const web3Provider = getProvider();
  return new IExecWeb3mail(web3Provider);
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

  const sendEmailToAll = async () => {
    console.log("sendEmailToAll: to be added");
  }

  useEffect(() => {
    fetchClient();
  }, []);

  return (
    <div>
      {/* <button onClick={fetchClient}>Fetch Clients</button> */}
      {loading && <p>loading</p>}
      {clients && (
        <div>
          <h4>Subscribers</h4>
          {clients && <div>
            <button className="red" onClick={sendEmailToAll}>Send Email to all</button>
          </div>}
          {clients.map((client) => (
            <div className="subscriber-elm" key={client.address}>
              <h5>{client.address}</h5>
              <button onClick={() => sendEmail(client.address)}>Send Email</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Admin() {
  const isAdmin = true;
  return (
    <>
      <div className="header">
        <span>
          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-download.com%2Fwp-content%2Fuploads%2F2022%2F01%2FUSD_Coin_USDC_Logo.png" className="logo" alt="Vite logo" />
        </span>
        <h1>Admin</h1>
      </div>
      <div className="grid">
        <div className="w50">
          <h2>Risk</h2>
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
        </div>
      </div>
      <p className="read-the-docs">
        This prediction is based on : {data.length} votes.
      </p>
      {!isAdmin && <div>
        <p>
          You are not allowed to add a vote.<br/>
          You can <a href="https://x.com/bertrandbuild" target="_blank">make a request</a> to become a voter.
        </p>
      </div>}
      {isAdmin && 
      <><h2>Admin</h2>
        <ClientList />
      </>
      }
    </>
  );
}

export default Admin;
