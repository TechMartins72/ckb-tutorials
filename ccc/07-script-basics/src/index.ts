import { ccc } from "@ckb-ccc/core";

const client = new ccc.ClientPublicTestnet();

const tip = await client.getTip();

console.log(`Connected! Current block height: ${tip}`);

const ADDRESS =
  "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvwg2cen8extgq8s5puft8vf40px3f599cytcyd8";

const script = await ccc.Address.fromString(ADDRESS, client);

for await (const cell of client.findCellsByLock(
  script.script,
  undefined,
  true,
  "desc",
  5,
)) {
  console.log("Lock script:", cell.cellOutput.lock);
  console.log("Type script:", cell.cellOutput.type ?? "(none)");
  console.log("Capacity:", cell.cellOutput.capacity);
}

const Secp256k1Blake160 = await client.getKnownScript(
  ccc.KnownScript.Secp256k1Blake160,
);
const dao = await client.getKnownScript(ccc.KnownScript.NervosDao);

console.log("Known script:", Secp256k1Blake160);
console.log("Known script:", dao);
