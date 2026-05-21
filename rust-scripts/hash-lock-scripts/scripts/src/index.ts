import { ccc, sleep } from "@ckb-ccc/core";
import { exit } from "process";
import { readFileSync } from "fs";
import { createLockedCell } from "./create-locked-cell";
import { unlockLockedCell } from "./unlock-locked-cell";

const client = new ccc.ClientPublicTestnet();
const DEPLOYER_PRIVATE_KEY =
  "0x9f315d5a9618a39fdc487c7a67a8581d40b045bd7a42d83648ca80ef3b2cb4a1";

const signer = new ccc.SignerCkbPrivateKey(client, DEPLOYER_PRIVATE_KEY);
const { script: lockScript } = await signer.getRecommendedAddressObj();

const binary = readFileSync(
  "../contracts/hash-lock/target/riscv64imac-unknown-none-elf/release/hash-lock",
);

const binaryHex = "0x" + binary.toString("hex");
const binarySize = binary.length;

const CAPACITY_FIELD_SIZE = 8;
const LOCK_SCRIPT_SIZE = 53;

const capacity =
  BigInt(CAPACITY_FIELD_SIZE + LOCK_SCRIPT_SIZE + binarySize) * BigInt(10 ** 8);

const balance = await signer.getBalance();

console.log("Deployer balance:", balance / BigInt(10 ** 8), "CKB");
console.log("Transaction Capacity: " + capacity / BigInt(10 ** 8) + " CKB");

const deployTx = ccc.Transaction.from({
  outputs: [
    {
      lock: lockScript,
      capacity,
    },
  ],
  outputsData: [binaryHex],
});

await deployTx.completeFeeBy(signer);
await signer.signTransaction(deployTx);
const deployTxHash = await client.sendTransaction(deployTx);
console.log("Deploy transaction sent! Tx hash:", deployTxHash);

const txWithStatus = await client.getTransaction(deployTxHash);
const txView = txWithStatus?.transaction;

console.log("See Complete Transaction: " + txView);

while (true) {
  const txResponse = await client.getTransaction(deployTxHash);
  if (txResponse && txResponse.status === "committed") {
    console.log({ txResponse });
    console.log("Confirmed!");
    break;
  }
  console.log("Waiting for confirmation...");
  await sleep(3000);
}

const lockedCellTxHash = await createLockedCell(
  client,
  signer,
  "SECRET-TEXT",
  binary,
);

await unlockLockedCell(client, deployTxHash, lockedCellTxHash, "SECRET-TEXT");

exit(0);
