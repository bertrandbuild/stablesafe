# StableSafe

A prediction market to alert you in case of depeg on stablecoins.

![hero](./image.png)

## Folder Architecture

- [/autonomous-voter](./autonomous-voter/): the code to setup a remote who can run 24/7 
- [/data](./data/) : contain various dataset and the list of events our 1st voter found during the backtesting analysis
- /src : the code of the frontend app

## Setup a voter

- You can setup a voter using see the associated [README.md](./autonomous-voter/README.md)

## Setup the interface

- you a modern dev env with node/yarn
- install metamask and add the iExec chain + ask to be whitelisted following [the iExec doc](https://tools.docs.iex.ec/)
  - the user of `ADMIN_USER_ADDRESS` will be granted the right to send email
- You can setup a new oracle using the code in /autonomous-voter/services/iExecOracle.mjs or use the example cid
- follow the tableland [getting started guide](https://docs.tableland.xyz/fundamentals) to setup a new tableland db, you can also use the example one but you will not be able to add vote and get an error
- setup the env variables using the template `cp .env.example .env`
- build using : `yarn build`
- start using : `yarn dev`
