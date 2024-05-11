import {ethers} from "ethers";
import { contractAddress, dymensionRpcAddress, privateKey } from "../utils/constants";
import { predictionAbi } from "./DymensionPredictionsABI";
import { PredictionForm } from "../types";

const provider = new ethers.providers.JsonRpcProvider(dymensionRpcAddress);
const wallet = new ethers.Wallet(privateKey, provider);
const predictionContract = new ethers.Contract(contractAddress, predictionAbi, wallet);

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

export async function readPrediction(id: number) {
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

export async function addToWhitelist(address: string) {
  try {
      const tx = await predictionContract.addToWhitelist(address);
      await tx.wait();
      console.log('Address successfully whitelisted:', address);
      return tx;
  } catch (error) {
      console.error('Error whitelisting address:', error);
  }
}

export async function addPrediction(prediction: PredictionForm) {
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