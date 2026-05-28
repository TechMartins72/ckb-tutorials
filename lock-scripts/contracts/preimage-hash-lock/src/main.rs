#![no_std]
#![no_main]

use ckb_std::entry; // The entry macro defines the entry point of the script.
use ckb_std::default_alloc; // Memory allocator
use ckb_std::high_level::{load_cell_lock, load_witness};
use ckb_hash::new_blake2b; 
use ckb_std::ckb_constants::Source; 
use ckb_std::ckb_types::prelude::*;

use alloc::vec::Vec;

entry!(main);
default_alloc!();

// User-Defined ERROR Codes
const ERROR_INVALID_ARGS_LENGTH: i8 = 5;  // Args not 32 bytes
const ERROR_NO_SCRIPT_FOUND: i8 = 9;  // No script found
const ERROR_NO_WITNESS: i8 = 6;           // No witness provided
const ERROR_EMPTY_PREIMAGE: i8 = 7;       // Witness is empty
const ERROR_HASH_MISMATCH: i8 = 8;        // Hash verification failed

const BLAKE2B_256_HASH_LEN: usize = 32;

fn blake2b_256(data: &[u8]) -> [u8; BLAKE2B_256_HASH_LEN] {
    let mut hasher = new_blake2b();

    hasher.update(data);

    // Finalize and get the 32-byte hash
    let mut hash = [0u8; BLAKE2B_256_HASH_LEN];
    hasher.finalize(&mut hash);
    hash
}

fn run() -> Result<(), i8> {
    // STEP 1: Load the currently executing script
    let script = match load_cell_lock(0, Source::GroupInput) {
        Ok(result) => result,
        Err(_) => {
            return Err(ERROR_NO_SCRIPT_FOUND);
        },
    };

    // STEP 2: Extract the expected hash from script args
    let args: bytes::Bytes = script.args().unpack();
    let expected_hash: Vec<u8> = args.to_vec();

    // Validate: args must be exactly 32 bytes (a blake2b-256 hash)
    if expected_hash.len() != BLAKE2B_256_HASH_LEN {
        return Err(ERROR_INVALID_ARGS_LENGTH);
    }

    let witness = match load_witness(0, Source::GroupInput) {
        Ok(witness) => witness,
        Err(_) => return Err(ERROR_NO_WITNESS),
    };

    let preimage: &[u8] = &witness;

    if preimage.is_empty() {
        return Err(ERROR_EMPTY_PREIMAGE);
    }

    let computed_hash = blake2b_256(preimage);

    if computed_hash[..] != expected_hash[..] {
        return Err(ERROR_HASH_MISMATCH);
    }
    
    Ok(())
}

fn main () -> i8 {
    match run() {
        Ok(()) => 0,
        Err(code) => code
    }
}