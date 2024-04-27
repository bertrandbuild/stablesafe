import { IExecDataProtector, getWeb3Provider } from "@iexec/dataprotector";
import 'dotenv/config'

const ADMIN_USER_ADDRESS = "0x754edfB906252B304f89c59c61f4368028bdcE6c";
const WEB3MAIL_APP_ADDRESS = "0x781482C39CcE25546583EaC4957Fb7Bf04C277D2";

export class IExecDataProtectorManager {
  constructor(chain) {
    const signer = getWeb3Provider(process.env.ADMIN_WALLET_PRIVATE_KEY)
    
    this.chain = chain;
    this.protector = new IExecDataProtector(signer);
  }

  async protectEmailAndGrantAccess(email) {
    const protectedData = await this.protector.protectData({ data: { email } });
    console.log("Protected Data:", protectedData);

    const grantedAccess = await this.protector.grantAccess({
      protectedData: protectedData.address,
      authorizedApp: WEB3MAIL_APP_ADDRESS,
      authorizedUser: ADMIN_USER_ADDRESS,
      pricePerAccess: 0,
      numberOfAccess: 100000000000000,
    });
    console.log("Access Granted:", grantedAccess);
  }
}
