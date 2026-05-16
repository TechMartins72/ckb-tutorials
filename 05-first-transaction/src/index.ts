import { ccc, sleep } from "@ckb-ccc/core";

const client = new ccc.ClientPublicTestnet();
const SENDER_PRIVATE_KEY =
  "0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6";
const RECIPIENT_ADDRESS =
  "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqt435c3epyrupszm7khk6weq5lrlyt52lg48ucew";
const AMOUNT_TO_TRANSFER = 10000n;

const signer = new ccc.SignerCkbPrivateKey(client, SENDER_PRIVATE_KEY);
const signerAddress = await signer.getAddressObjSecp256k1();
const balance = await signer.getBalance();
const senderBalance = await client.getBalanceSingle(signerAddress.script);
console.log("Sender balance:", balance / BigInt(10 ** 8), "CKB");
console.log(
  "Sender balance from client:",
  senderBalance / BigInt(10 ** 8),
  "CKB",
);

const parsedAddress = await ccc.Address.fromString(RECIPIENT_ADDRESS, client);

const tx = ccc.Transaction.from({
  outputs: [
    {
      lock: parsedAddress.script,
      capacity: AMOUNT_TO_TRANSFER * BigInt(10 ** 8), // IN SHANNONS
    },
  ],
  outputsData: ["0x"],
});

await tx.completeFeeBy(signer);
await signer.signTransaction(tx);
const txHash = await client.sendTransaction(tx);
console.log("Transaction sent! Tx hash:", txHash);

const txWithStatus = await client.getTransaction(txHash);
const txView = txWithStatus?.transaction;

console.log("See Complete Transaction: " + txView);

while (true) {
  const txResponse = await client.getTransaction(txHash);
  if (txResponse && txResponse.status === "committed") {
    console.log({ txResponse });
    console.log("Confirmed!");
    break;
  }
  console.log("Waiting for confirmation...");
  await sleep(3000);
}

// CHECK BALANCE TO VERIFY TRANSACTION SUCCESS
const updatedBalance = await signer.getBalance();
const receiverBalance = await client.getBalanceSingle(parsedAddress.script);
console.log("Updated sender balance:", updatedBalance / BigInt(10 ** 8), "CKB");
console.log("Receiver's balance:", receiverBalance / BigInt(10 ** 8), "CKB");
