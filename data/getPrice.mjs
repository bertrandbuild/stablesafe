import fs from "fs/promises";
import fetch from "node-fetch";

const API_KEY = ""; // TODO: set in .env

export const getCoinList = async query => {
  const url = "https://api.coingecko.com/api/v3/coins/list";
  const options = {
    method: "GET",
    headers: { accept: "application/json", "x-cg-pro-api-key": API_KEY },
  };
  return fetch(url, options)
    .then(res => res.json())
    .then(json => json.filter(coin => coin.symbol.includes(query)))
    .catch(err => console.error("error:" + err));
};

export const getAndSaveUsdc = async () => {
  // Get various usdc list
  const data = await getCoinList("usdc");
  await fs.writeFile("data.json", JSON.stringify(data)).then(() => console.log("data saved to data.json"));
};

export const getUsdcRangeData = async param => {
  const url = `https://api.coingecko.com/api/v3/coins/${param.coinId}/market_chart/range?vs_currency=${param.vs_currency}&from=${param.from}&to=${param.to}`;
  console.log(url);
  const options = {
    method: "GET",
    headers: { accept: "application/json", "x-cg-pro-api-key": API_KEY },
  };

  return fetch(url, options)
    .then(res => res.json())
    .catch(err => console.error("error:" + err));
};

export const getDataPriceFromUsdcDepeg = async () => {
  // Get historical data from 1678338000 (9march'23) to 1679184000 (19march'23) of the "usd-coin" = the global usdc
  const data = await getUsdcRangeData({
    coinId: "usd-coin",
    vs_currency: "usd",
    from: 1678338000,
    to: 1679184000,
  });
  await fs.writeFile("data.json", JSON.stringify(data)).then(() => console.log("data saved to data.json"));
};

getCoinList("usdc");
getAndSaveUsdc();
getDataPriceFromUsdcDepeg();