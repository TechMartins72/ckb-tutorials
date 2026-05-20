const SHANNONS_PER_CKBYTE = 100_000_000n;
const CAPACITY_FIELD_SIZE = 8;
const DEFAULT_LOCK_SCRIPT_SIZE = {
  codeHash: 32,
  hashType: 1,
  args: 20,
};
export const SECONDARY_ISSUANCE = 1_344_000_000n; //annualCKB

export function calculateCapacity(
  dataSize: number,
  hasTypeScript: boolean = false,
  lockArgsSize: number = DEFAULT_LOCK_SCRIPT_SIZE.args,
  typeArgsSize: number = DEFAULT_LOCK_SCRIPT_SIZE.args,
) {
  const lockScriptBytes =
    DEFAULT_LOCK_SCRIPT_SIZE.codeHash +
    DEFAULT_LOCK_SCRIPT_SIZE.hashType +
    lockArgsSize;
  const typeScriptBytes = hasTypeScript
    ? DEFAULT_LOCK_SCRIPT_SIZE.codeHash +
      DEFAULT_LOCK_SCRIPT_SIZE.hashType +
      typeArgsSize
    : 0;

  const totalBytes =
    CAPACITY_FIELD_SIZE + lockScriptBytes + typeScriptBytes + dataSize;
  const totalShannons = BigInt(totalBytes) * SHANNONS_PER_CKBYTE;

  return {
    capacityFieldBytes: CAPACITY_FIELD_SIZE,
    lockScriptBytes,
    typeScriptBytes,
    dataBytes: dataSize,
    totalBytes,
    totalShannons,
    totalCKBytes: totalBytes,
  };
}
