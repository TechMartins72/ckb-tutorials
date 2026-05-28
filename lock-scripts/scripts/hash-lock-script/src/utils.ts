import { ccc } from "@ckb-ccc/core";

export const getTransactionDetails = async (
  txHash: string,
  client: ccc.Client,
) => {
  const tx = await client.getTransaction(txHash);
  const capacity = tx?.transaction.getOutputsCapacity();

  console.log("Capacity of the cell: " + capacity);

  tx?.transaction.outputs.forEach((output, index) => {
    const lockScript = output.lock;
    const codeHash = lockScript.codeHash;
    const hashType = lockScript.hashType;
    const args = lockScript.args;
    console.log({ codeHash, hashType, args });
    console.log({ index });
  });
};

export function counterToHex(value: number): string {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, BigInt(value), true); // true = little-endian
  const bytes = new Uint8Array(buffer);
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}
