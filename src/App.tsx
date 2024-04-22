import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { IExecDataProtector } from "@iexec/dataprotector";

const ADMIN_USER_ADDRESS = "0x754edfB906252B304f89c59c61f4368028bdcE6c";
const WEB3MAIL_APP_ADDRESS = "0x781482C39CcE25546583EaC4957Fb7Bf04C277D2";

const getProvider = () => {
  const web3Provider = window.ethereum;
  if (!web3Provider) {
    throw new Error("No web3 provider available.");
  }
  return web3Provider;
};

async function initDataProtector() {
  const web3Provider = getProvider();
  const dataProtector = new IExecDataProtector(web3Provider);
  if (!dataProtector) {
    throw new Error("Data protector is not available.");
  }

  try {
    const protectedData = await dataProtector.protectData({ data: { "test@mail.com" } });
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

function App() {

  initDataProtector();

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
      <div className="card">
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default App
