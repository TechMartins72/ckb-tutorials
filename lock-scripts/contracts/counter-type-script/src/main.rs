#![no_std]
#![no_main]

use ckb_std::entry;
use ckb_std::default_alloc;
use ckb_std::error::SysError;
use ckb_std::high_level::load_cell_data;
use ckb_std::ckb_constants::Source;

entry!(main);
default_alloc!();

const ERROR_INVALID_DATA_LENGTH: i8 = 5;
const ERROR_COUNTER_NOT_ZERO_ON_CREATION: i8 = 6;
const ERROR_INVALID_CELL_COUNT: i8 = 7;
const ERROR_COUNTER_NOT_INCREMENTED: i8 = 8;

fn count_cells_in_group(source: Source) -> usize {
    let mut count = 0;
    loop {
        match load_cell_data(count, source) {
            Ok(_) => count += 1,
            Err(SysError::IndexOutOfBound) => break,
            Err(_) => return 0,
        }
    }
    count
}

fn parse_counter(data: &[u8]) -> Result<u64, i8> {
    if data.len() != 8 {
        return Err(ERROR_INVALID_DATA_LENGTH);  // also fixed — was missing Err() wrapper
    }
    let bytes: [u8; 8] = data.try_into().map_err(|_| ERROR_INVALID_DATA_LENGTH)?;
    Ok(u64::from_le_bytes(bytes))
}

fn run() -> Result<(), i8> {   // ← does the real work, ? works here
    let input_count = count_cells_in_group(Source::GroupInput);
    let output_count = count_cells_in_group(Source::GroupOutput);

    match (input_count, output_count) {
        (0, _) => {
            for i in 0..output_count {
                let data = load_cell_data(i, Source::GroupOutput)
                    .map_err(|_| ERROR_INVALID_DATA_LENGTH)?;
                let counter = parse_counter(&data)?;
                if counter != 0 {
                    return Err(ERROR_COUNTER_NOT_ZERO_ON_CREATION);
                }
            }
            Ok(())
        }

        (_, _) if input_count > 0 && output_count > 0 => {
            if input_count != 1 || output_count != 1 {
                return Err(ERROR_INVALID_CELL_COUNT);
            }
            let input_data = load_cell_data(0, Source::GroupInput)
                .map_err(|_| ERROR_INVALID_DATA_LENGTH)?;
            let input_counter = parse_counter(&input_data)?;

            let output_data = load_cell_data(0, Source::GroupOutput)
                .map_err(|_| ERROR_INVALID_DATA_LENGTH)?;
            let output_counter = parse_counter(&output_data)?;

            if output_counter != input_counter + 1 {
                return Err(ERROR_COUNTER_NOT_INCREMENTED);
            }
            Ok(())
        }

        (_, 0) => Ok(()),
        _ => Ok(()),
    }
}

fn main() -> i8 {   // ← CKB entry point, must return i8
    match run() {
        Ok(()) => 0,
        Err(code) => code,
    }
}