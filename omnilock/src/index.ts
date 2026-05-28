import { ccc } from "@ckb-ccc/core";

const client = new ccc.ClientPublicTestnet();

console.log(await client.getTip());

const script = ccc.Script.fromKnownScript(
  client,
  ccc.KnownScript.AnyoneCanPay,
  "0x00<recipient-pubkey-hash>",
);

console.log({ script });

// const PRIVATE_KEY =
//   "0xace08599f3174f4376ae51fdc30950d4f2d731440382bb0aa1b6b0bd3a9728cd";

// const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY);
// const { script: lockScript } = await signer.getRecommendedAddressObj();

// console.log({ lockScript });
