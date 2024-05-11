import { IExecDataProtector } from "@iexec/dataprotector";
import { WEB3MAIL_APP_ADDRESS, ADMIN_USER_ADDRESS } from "../utils/constants";
import { getProvider } from "./provider";

export class IExecDataProtectorManager {
  protector: IExecDataProtector;
  constructor() {
    const web3Provider = getProvider();
    this.protector = new IExecDataProtector(web3Provider);
  }

  async protectEmailAndGrantAccess(email: string): Promise<string> {
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
    return protectedData.address;
  }
}
