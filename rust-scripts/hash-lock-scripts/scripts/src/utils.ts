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
