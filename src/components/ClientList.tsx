import { Contact, IExecWeb3mail } from "@iexec/web3mail";
import { useState, useEffect } from "react";
import { getProvider } from "../services/provider";
import { SEND_TO_ALL_URL } from "../utils/constants";

export function ClientList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<Contact[]>();

  async function initWeb3mail() {
    const web3Provider = getProvider();
    return new IExecWeb3mail(web3Provider);
  }

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
      emailContent:
        "The usdc price is de-pegging. Please check the price on the website.",
      contentType: "text/html",
      senderName: "Depeg Alert team",
    });
    console.log("sendEmail", sendEmail);
  };

  const sendEmailToAll = async () => {
    const url = SEND_TO_ALL_URL;
    fetch(url)
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);  // Handling the data from the response
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  useEffect(() => {
    fetchClient();
  }, []);

  return (
    <div>
      {loading && <p>loading</p>}
      {clients && (
        <div>
          {clients && (
            <div>
              <button className="red" onClick={sendEmailToAll}>
                Send Email to all
              </button>
            </div>
          )}
          {clients.map((client) => (
            <div className="list-elm" key={client.address}>
              <h5>{client.address}</h5>
              <button onClick={() => sendEmail(client.address)}>
                Send Email
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
