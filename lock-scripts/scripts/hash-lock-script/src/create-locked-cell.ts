import { ccc, sleep } from "@ckb-ccc/core";
import { getTransactionDetails } from "./utils";

export const createLockedCell = async (
  client: ccc.Client,
  signer: ccc.SignerCkbPrivateKey,
  preimage: string,
  binary: Buffer,
): Promise<string> => {
  const preimageBytes = new TextEncoder().encode(preimage);
  const preimageHash = ccc.hashCkb(preimageBytes);

  const binaryHash = ccc.hashCkb(binary);
  console.log("Binary hash:", binaryHash);

  const lockScript = ccc.Script.from({
    codeHash: binaryHash,
    hashType: "data1",
    args: preimageHash,
  });

  const tx = ccc.Transaction.from({
    outputs: [{ lock: lockScript, capacity: 150n * BigInt(10 ** 8) }],
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

  await getTransactionDetails(txHash, client);

  return txHash;
};
