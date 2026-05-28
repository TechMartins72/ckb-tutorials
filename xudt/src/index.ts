import { ccc } from "@ckb-ccc/core";

const client = new ccc.ClientPublicTestnet();

const tip = client.getTip();

console.log("Current tip:", tip);

