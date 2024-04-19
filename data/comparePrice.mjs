import fs from "fs/promises";

const dataSet = await fs
  .readFile("dataset/data_usdt_price_history.json", "utf-8")
  .then(data => JSON.parse(data).data);

const is2023depeg = point => point.dt.split("T")[0] >= "2023-03-08" && point.dt.split("T")[0] <= "2023-04-08";

let depegCounter = 0;

for (let i = 0; i < dataSet.length; i++) {
  const point = dataSet[i];
  if (is2023depeg(point)) {
    continue;
  }
  if (point.c < 0.994) {
    if (dataSet[i - 1].c < 0.994) {
      continue;
    }
    depegCounter += 1;
    console.log(`potential depeg, on: ${point.dt} at closing price: ${point.c}`);
  }
}
console.log(`potential depeg counter: ${depegCounter}`);
