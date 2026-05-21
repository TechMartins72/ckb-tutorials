import { ccc } from "@ckb-ccc/core";

const client = new ccc.ClientPublicTestnet();
const CELL_BLOCK_NUMBER = 21097264n; // CHANGE THIS TO THE BLOCK NUMBER YOU WANT TO ANALYZE

let block = await client.getBlockByNumber(CELL_BLOCK_NUMBER);

const loopTransaction = async () => {
  if (block === undefined) {
    console.log("Block not found!");
    return;
  }
  console.log("Block Transactions length:", block.transactions.length);
  // i = 1 BACAUSE THE FIRST TRANSACTION WAS CREATED BY THE MINER, THE REST WERE CREATED BY THE USERS
  for (let i = 1; i < block.transactions.length; i++) {
    const tx = block.transactions[i];
    console.log("Transaction Hash:", tx.hash());
    console.log("Transaction Fee:", await calculateFee(tx));
  }
};

const calculateFee = async (tx: ccc.Transaction) => {
  let inputsCapacity = 0n;

  for (const input of tx.inputs) {
    const prevTx = await client.getTransaction(input.previousOutput.txHash);
    const idx = Number(input.previousOutput.index);
    inputsCapacity += prevTx?.transaction.outputs[idx].capacity || 0n;
  }

  let outputsCapacity = 0n;
  tx.outputs.forEach((output) => {
    outputsCapacity += output.capacity;
  });

  return inputsCapacity - outputsCapacity;
};

await loopTransaction();
