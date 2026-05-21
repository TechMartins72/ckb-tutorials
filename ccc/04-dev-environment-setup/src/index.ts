import { ccc } from "@ckb-ccc/core";

// Create a client connected to the CKB public testnet.
// This connects to the Pudge/Aggron testnet RPC endpoint.
// No API key needed — it's a public endpoint.
const client = new ccc.ClientPublicTestnet();

// Verify connectivity by fetching the current chain tip
const tipBlockNumber = await client.getTip();
console.log("Connected! Current block height:", tipBlockNumber);

// Fetch the tip block header for more details
const tipHeader = await client.getHeaderByNumber(tipBlockNumber);
if (tipHeader) {
  const timestamp = new Date(Number(tipHeader.timestamp));
  console.log("Latest block time:", timestamp.toISOString());
}


