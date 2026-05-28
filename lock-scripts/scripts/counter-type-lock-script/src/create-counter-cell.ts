import { ccc } from "@ckb-ccc/core";

const client = new ccc.ClientPublicTestnet();
const tip = await client.getTip();
console.log("Current tip:", tip);

const PRIVATE_KEY =
  "0xace08599f3174f4376ae51fdc30950d4f2d731440382bb0aa1b6b0bd3a9728cd";
const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY);
const { script } = await signer.getRecommendedAddressObj();

