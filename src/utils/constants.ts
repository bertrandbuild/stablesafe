// IEXEC
export const ADMIN_USER_ADDRESS = import.meta.env.VITE_ADMIN_USER_ADDRESS
export const ORACLE_CID = import.meta.env.VITE_ORACLE_CID
export const WEB3MAIL_APP_ADDRESS = import.meta.env.VITE_WEB3MAIL_APP_ADDRESS;
export const SEND_TO_ALL_URL = import.meta.env.VITE_SEND_TO_ALL_URL;
export const chain = "bellecour";
export const IEXEC_EXPLORER_URL = `https://explorer.iex.ec/${chain}/dataset/`;
export const IEXEC_API_URL = `https://iexec-api.vercel.app/subscribe`;
// TABLELAND
export const VOTES_CHAIN_URL = import.meta.env.VITE_VOTES_CHAIN_URL
export const TABLE_NAME = import.meta.env.VITE_TABLE_NAME
export const USDC_ASSET_ID = import.meta.env.VITE_USDC_ASSET_ID
// DYMENSION CONTRACTS
export const dymensionRpcAddress = 'https://json-rpc.rolxtwo.evm.ra.blumbus.noisnemyd.xyz';
export const privateKey = import.meta.env.VITE_KEY; // TODO: use litprocol to handle private signing
export const contractAddress = '0x9F9CF2fA6a7a91eFadd0ee41b2aC4e183D0765D2';