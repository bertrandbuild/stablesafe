import { ethers } from "ethers";
import { PREDICTION_CONTRACT_ADDRESS, DYMENSION_RPC_ADDRESS, PRIVATE_KEY } from "../utils/constants";
import { predictionAbi } from "./DymensionPredictionsABI";
import { PredictionForm, StakedPredictionForm } from "../types";
import { getProviderAndSigner } from "./provider";

async function getUserPredictionContract() {
  const { signer } = await getProviderAndSigner();
  const predictionContract = new ethers.Contract(PREDICTION_CONTRACT_ADDRESS, predictionAbi, signer);
  return predictionContract;
}

async function getAdminPredictionContract() {
  const provider = new ethers.providers.JsonRpcProvider(DYMENSION_RPC_ADDRESS);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const predictionContract = new ethers.Contract(PREDICTION_CONTRACT_ADDRESS, predictionAbi, wallet);
  return predictionContract;
}

export async function getAllPredictionIds() {
  try {
    const predictionContract = await getAdminPredictionContract();
    const allPredictionIds = await predictionContract.getAllPredictionIds();
    console.log('Ids:', allPredictionIds);
    return allPredictionIds;
  } catch (error) {
    console.error('Error reading from the contract:', error);
  }
}

export async function getAllStakedPredictionIds() {
  try {
    const predictionContract = await getAdminPredictionContract();
    const allPredictionIds = await predictionContract.getAllStakedPredictionIds();
    console.log('Ids:', allPredictionIds);
    return allPredictionIds;
  } catch (error) {
    console.error('Error reading from the contract:', error);
  }
}

export async function isWhitelisted(address?: string) {
  const predictionContract = await getAdminPredictionContract();
  const walletAddress = address || (await getProviderAndSigner()).signer.getAddress();
  try {
    const isWhitelisted = await predictionContract.whitelist(walletAddress);
    console.log('is whitelisted:', isWhitelisted);
    return isWhitelisted;
  } catch (error) {
    console.error('Error reading from the contract:', error);
  }
}

export async function readPrediction(id: number) {
  try {
    const predictionContract = await getAdminPredictionContract();
    const prediction = await predictionContract.getPrediction(id);
    console.log('Prediction:', prediction);
    return prediction;
  } catch (error) {
    console.error('Error reading from the contract:', error);
  }
}

export async function readStakedPrediction(id: number) {
  try {
    const predictionContract = await getAdminPredictionContract();
    const prediction = await predictionContract.getStakedPrediction(id);
    console.log('Prediction:', prediction);
    return prediction;
  } catch (error) {
    console.error('Error reading from the contract:', error);
  }
}

export async function addToWhitelist(address: string) {
  try {
    const predictionContract = await getUserPredictionContract();
    const tx = await predictionContract.addToWhitelist(address);
    await tx.wait();
    console.log('Address successfully whitelisted:', address);
    return tx;
  } catch (error) {
    console.error('Error whitelisting address (pls check ownership) :', error);
  }
}

export async function addPrediction(prediction: PredictionForm) {
  const { signer } = await getProviderAndSigner();
  const address = await signer.getAddress();
  try {
    const predictionContract = await getUserPredictionContract();
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
    await tx.wait();
    console.log('Transaction :', tx);
    console.log('Transaction Hash:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error writing to the contract:', error);
  }
}

export async function addStakedPrediction(prediction: StakedPredictionForm) {
  const { signer } = await getProviderAndSigner();
  const address = await signer.getAddress();
  try {
    const predictionContract = await getUserPredictionContract();
    const isWhitelisted = await predictionContract.whitelist(address);
    if (!isWhitelisted) {
      console.error("User is not whitelisted.");
      return;
    }
    const tx = await predictionContract.addStakedPrediction(
      prediction.date,
      prediction.assetId,
      prediction.notation,
      prediction.notationReason,
      {
        value: ethers.utils.parseEther(prediction.stake)
      }
    );
    await tx.wait();
    console.log('Transaction :', tx);
    console.log('Transaction Hash:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error writing to the contract:', error);
  }
}

async function sendNativeToken(receiverAddress: string, amountInNativeToken: string) {
  const { signer } = await getProviderAndSigner();
  const tx = await signer.sendTransaction({
      to: receiverAddress,
      value: amountInNativeToken  // Convert Native token to uNative
  });

  await tx.wait();
  return tx;
}

export async function authorizeAndSubscribe() {
  try {
    // Check current allowance
    const { signer } = await getProviderAndSigner();
    const balance = await signer.getBalance();
    const price = "0.01";

    if (balance.lt(ethers.utils.parseEther(price))) {
      throw new Error("User does not have enough balance or is not connected to the RolX network.");
    }

    // Subscribe the user
    const subscribeTx = await sendNativeToken(PREDICTION_CONTRACT_ADDRESS, (Number(price)*10**18).toString());
    console.log("Transaction Response:", subscribeTx);
    return subscribeTx;
  } catch (error) {
    console.error("An error occurred during the subscription process:", error);
    throw error;
  }
}

export async function resolvePrediction(predictionId: number, wasUseful: boolean) {
  console.log('resolve prediction', predictionId, wasUseful);
  try {
    const predictionContract = await getUserPredictionContract();
    const tx = await predictionContract.resolvePrediction(predictionId, wasUseful);
    await tx.wait();
    console.log('vote successfully created');
    return tx;
  } catch (error) {
    console.error('Error :', error);
  }
}
