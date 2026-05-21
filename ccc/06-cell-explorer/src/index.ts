import { ccc } from "@ckb-ccc/core";

const client = new ccc.ClientPublicTestnet();

const tip = await client.getTip();
console.log(`Connected! Current block: ${tip}`);

const ADDRESS =
  "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq2prryvze6fhufxkgjx35psh7w70k3hz7c3mtl4d";

const parsedAddress = await ccc.Address.fromString(ADDRESS, client);
const lockScript = parsedAddress.script;

for await (const cell of client.findCellsByLock(
  lockScript,
  null,
  false,
  "asc",
  10,
)) {
  console.log(`Cell: ${cell.outPoint.txHash}:${cell.outPoint.index}`);
  console.log(`  Capacity: ${cell.cellOutput.capacity} shannons`);
  console.log(`  Has type: ${!!cell.cellOutput.type}`);
  console.log(`  Data: ${cell.outputData}`);
}

const filteredCells = client.findCells({
  script: lockScript,
  scriptType: "lock",
  scriptSearchMode: "exact",
  filter: {
    outputCapacityRange: [100n * 100_000_000n, 1_000n * 100_000_000n],
  },
  withData: true,
});
