import { ccc, sleep } from "@ckb-ccc/core";
import { getTransactionDetails } from "./utils";

export const unlockLockedCell = async (
  client: ccc.Client,
  deployedTxHash: string,
  lockedCellTxHash: string,
  preimage: string,
) => {
  const PRIVATE_KEY =
    "0xace08599f3174f4376ae51fdc30950d4f2d731440382bb0aa1b6b0bd3a9728cd";
  const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY);
  const address = await signer.getRecommendedAddressObj();
  const recipientLockScript = ccc.Address.from(address).script;

  const unlockTx = ccc.Transaction.from({
    inputs: [
      {
        previousOutput: {
          txHash: lockedCellTxHash, // Replace with the actual transaction hash of the locked cell
          index: 0,
        },
      },
    ],
    outputs: [
      {
        lock: recipientLockScript,
        capacity: 149_99_000_000n,
      },
    ],
    outputsData: ["0x"],
    cellDeps: [
      {
        outPoint: {
          txHash: deployedTxHash,
          index: 0,
        },
        depType: "code",
      },
    ],
  });

  const preimageHex = ("0x" + Buffer.from(preimage).toString("hex")) as ccc.Hex;
  console.log("Preimage hash:", preimageHex);

  unlockTx.witnesses[0] = preimageHex as ccc.Hex;

  await unlockTx.completeFeeBy(signer);
  await signer.signTransaction(unlockTx);
  const txHash = await client.sendTransaction(unlockTx);
  console.log("Unlock transaction sent! Tx hash:", txHash);

  const txWithStatus = await client.getTransaction(txHash);
  const txView = txWithStatus?.transaction;

  console.log("See Complete Transaction: " + txView);

  while (true) {
    const txResponse = await client.getTransaction(txHash);
    if (txResponse && txResponse.status === "committed") {
      console.log({ txResponse });
      console.log("Unlock transaction confirmed!");
      break;
    }
    console.log("Waiting for confirmation...");
    await sleep(3000);
  }

  getTransactionDetails(txHash, client);
};
