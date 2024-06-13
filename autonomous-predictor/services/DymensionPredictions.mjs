import {ethers} from "ethers";
import { predictionAbi } from "./DymensionPredictionsABI.mjs";

const provider = new ethers.providers.JsonRpcProvider('https://json-rpc.rolxtwo.evm.ra.blumbus.noisnemyd.xyz');
const wallet = new ethers.Wallet(process.env.ADMIN_WALLET_PRIVATE_KEY, provider);
const predictionContract = new ethers.Contract('0xE18f112AD81251c24C6AA5c28285Ac2743818741', predictionAbi, wallet);

export async function getAllPredictionIds() {
  try {
      const allPredictionIds = await predictionContract.getAllPredictionIds();
      console.log('Ids:', allPredictionIds);
      return allPredictionIds;
  } catch (error) {
      console.error('Error reading from the contract:', error);
  }
}

export async function isWhitelisted() {
  const address = await wallet.getAddress();
  try {
      const isWhitelisted = await predictionContract.whitelist(address);
      console.log('is whitelisted:', isWhitelisted);
      return isWhitelisted;
  } catch (error) {
      console.error('Error reading from the contract:', error);
  }
}

export async function readPrediction(id) {
  const address = await wallet.getAddress();
  console.log('Address:', address);
  try {
      const prediction = await predictionContract.getPrediction(id);
      console.log('Prediction:', prediction);
      return prediction;
  } catch (error) {
      console.error('Error reading from the contract:', error);
  }
}

export async function addToWhitelist(address) {
  try {
      const tx = await predictionContract.addToWhitelist(address);
      await tx.wait();
      console.log('Address successfully whitelisted:', address);
      return tx;
  } catch (error) {
      console.error('Error whitelisting address:', error);
  }
}

export async function addPrediction(prediction) {
  const address = await wallet.getAddress();
  try {
      const isWhitelisted = await predictionContract.whitelist(address);
      if (!isWhitelisted) {
          console.error("User is not whitelisted.");
          return;
      }
      const tx = await predictionContract.addPrediction(
        prediction.date,
        prediction.assetId,
        prediction.notation,
        prediction.notationReason
    );
      await tx.wait(); // Wait for the transaction to be mined
      console.log('Transaction :', tx);
      console.log('Transaction Hash:', tx.hash);
      return tx;
  } catch (error) {
      console.error('Error writing to the contract:', error);
  }
}
