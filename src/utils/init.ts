import { addPrediction, addToWhitelist, isWhitelisted, readPrediction } from "../services/DymensionPredictions"

export async function init(address: string) {
  const isWhitelist = await isWhitelisted(address);
  const hasPrediction = await readPrediction(1)
  if (isWhitelist && hasPrediction) {
    return
  }
  addToWhitelist(address)
  addPrediction({
    date: new Date().getTime(),
    assetId: 1,
    notation: 1,
    notationReason: 'market price and news are stable'
  })
  addPrediction({
    date: new Date().getTime(),
    assetId: 1,
    notation: 2,
    notationReason: 'new EU regulation is coming, just rumors for now'
  })
}
