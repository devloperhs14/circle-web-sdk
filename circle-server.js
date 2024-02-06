const yargs = require("yargs");
const {
  initiateUserControlledWalletsClient,
} = require("@circle-fin/user-controlled-wallets");

require("dotenv").config();

const client = initiateUserControlledWalletsClient({
  apiKey: process.env.API_KEY,
});

// #Step 1 - Create a new user
async function createNewUser() {
  let response = await client.createUser({
    userId: "ENTER USERNAME HERE",
  });

  console.log(`${userId} created successfully`);
}

// #Step 2 - Create session token
async function createSessionToken() {
  let response = await client.createUserToken({
    userId: "ENTER USERNAME HERE",
  });

  console.log(response.data);
}

// #Step 3 - Create Challenge for Wallet Creation
async function createChallengeForWalletCreation() {
  let response = await client.createUserPinWithWallets({
    userId: "ENTER USERNAME HERE",
    blockchains: ["ETH-SEPOLIA"],
    userToken: process.env.USER_TOKEN_1,
  });

  console.log(response.data?.challengeId);
}

// #Step 4 - Create Challenge for SCA Wallet Creation
async function createChallengeForSCAWalletCreation() {
  let response = await client.createUserPinWithWallets({
    userId: "ENTER USERNAME HERE",
    blockchains: ["ETH-SEPOLIA"],
    accountType: "SCA",
    userToken: process.env.USER_TOKEN_2,
  });

  console.log(response.data?.challengeId);
}

// #Step 5 - Fetch Wallet Balance
async function fetchWallet() {
  let response = await client.getWalletTokenBalance({
    walletId: process.env.SCA_WALLET_ID,
    userToken: process.env.USER_TOKEN_2,
    userId: "ENTER USERNAME HERE",
  });

  console.log(response.data?.tokenBalances);
}

// #Step 6 - Create Challenge for Outbound Transfer
async function createChallengeForOutboundTransfer() {
  let response = await client.createTransaction({
    idempotencyKey: "ENTER IDEMPOTENCY KEY VALUE HERE",
    amounts: ["0.1"],
    destinationAddress: "ENTER DESTINATION HERE",
    tokenId: "ENTER USDC TOKEN ID HERE",
    walletId: process.env.SCA_WALLET_ID,
    userId: "ENTER USERNAME HERE",
    fee: {
      type: "level",
      config: {
        feeLevel: "MEDIUM",
      },
    },
    userToken: process.env.USER_TOKEN_2,
  });
  console.log(response.data?.challengeId);
}

yargs
  .scriptName("circle_server")
  .usage("$0 <cmd> [args]")

  .command(
    "create-user",
    "Create a new user",
    () => {},
    (argv) => {
      createNewUser();
    }
  )

  .command(
    "create-token",
    "Create a session token",
    () => {},
    (argv) => {
      createSessionToken();
    }
  )

  .command(
    "create-challenge-wallet",
    "Create Challenge to Create Wallet",
    () => {},
    (argv) => {
      createChallengeForWalletCreation();
    }
  )

  .command(
    "create-challenge-sca-wallet",
    "Create Challenge to Create SCA Wallet",
    () => {},
    (argv) => {
      createChallengeForSCAWalletCreation();
    }
  )

  .command(
    "fetch-wallet",
    "Fetch wallet",
    () => {},
    (argv) => {
      fetchWallet();
    }
  )

  .command(
    "create-challenge-outbound-transfer",
    "Create Challenge for Outbound Transfer",
    () => {},
    (argv) => {
      createChallengeForOutboundTransfer();
    }
  )

  .help().argv;
