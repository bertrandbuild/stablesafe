import { IExecWeb3mail, getWeb3Provider } from "@iexec/web3mail";
import 'dotenv/config'


export class IExecWeb3mailManager {
  constructor(chain) {
    const signer = getWeb3Provider(process.env.ADMIN_WALLET_PRIVATE_KEY)

    this.chain = chain;
    this.web3mail = new IExecWeb3mail(signer);
  }

  async sendEmail(protectedAddress) {
    const emailSender = await this.web3mail.sendEmail({
      protectedData: protectedAddress,
      emailSubject: "Depeg Alert - USDC is falling",
      emailContent: "The usdc price is de-pegging. Please check the price on the website.",
      contentType: "text/html",
      senderName: "Depeg Alert team"
    });
    console.log("sendEmail", emailSender);
  }

  async listContact() {
    return await this.web3mail.fetchMyContacts();
  }

  async sendEmailToAllContacts() {
    try {
      const contacts = await this.listContact();
      for (const contact of contacts) {
        await this.sendEmail(contact.address);
        const dalay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await dalay(1000);
        console.log("Email sent to:", contact.address);
      }
    } catch (error) {
      console.error("Failed to send emails:", error);
    }
  }

}
