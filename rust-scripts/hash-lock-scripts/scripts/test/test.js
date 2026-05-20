// Testing Checklist
// When testing a lock script, verify these scenarios:

// Happy path: Correct preimage unlocks the cell (exit code 0)
// Wrong preimage: Incorrect preimage is rejected (exit code 8)
// No witness: Missing witness is rejected (exit code 6)
// Empty witness: Empty preimage is rejected (exit code 7)
// Invalid args: Wrong args length is rejected (exit code 5)
// Multiple inputs: Multiple hash-locked inputs in the same group work correctly
