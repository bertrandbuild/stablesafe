## StableSafe contracts

Using [Foundry](https://book.getfoundry.sh)

## Usage

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Deploy

```shell
forge create --rpc-url <your_rpc_url> --private-key <your_private_key> src/PredictionContract.sol:PredictionContract --constructor-args <the_deployer_address>
```

### Generate ABIs

```shell
forge build --silent && jq '.abi' ./out/PredictionContract.sol/PredictionContract.json
```

### Help

```shell
forge --help
anvil --help
cast --help
```
