import {ccc} from '@ckb-ccc/core';

const client = new ccc.ClientPublicTestnet()
const tip = await client.getTip()
console.log(`Connected! Current block height: ${tip}`)

// This uses the default SECP256K1-BLAKE160 lock with known testnet args
const lockScript: ccc.ScriptLike = {
  codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  hashType: "type",
  args: "0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6",
};

// findCellsByLock returns an async generator
// Each yielded item is a Cell object with cellOutput and outputData
const CELLS = client.findCellsByLock(lockScript);

for await (const cell of CELLS) {
  console.log("Capacity:", shannonsToCKB(cell.cellOutput.capacity));
  console.log("Has type script:", cell.cellOutput.type !== null);
  console.log("Data length:", cell.outputData.length, "bytes");
}

// Convert shannons to CKBytes for display
function shannonsToCKB(shannons: bigint): string {
  const whole = shannons / 100_000_000n;
  const frac = shannons % 100_000_000n;
  return frac === 0n
    ? `${whole} CKB`
    : `${whole}.${frac.toString().padStart(8, "0").replace(/0+$/, "")} CKB`;
}

shannonsToCKB(123456789n) // "1.23456789 CKB"