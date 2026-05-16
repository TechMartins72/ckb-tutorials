import { calculateCapacity } from "./utils";

// IF CELL HAS NOT TYPE SCRIPT AND NO DATA, THE CAPACITY SHOULD BE: 61 CKBytes
const capacityForPlainCell = calculateCapacity(0, false);
console.log(
  "Capacity for cell with no type script and no data: ",
  capacityForPlainCell.totalCKBytes + " CKBytes",
);

// IF WE STORE A 32 BYTES DATA IN THE CELL, THE CAPACITY SHOULD BE: 93 CKBytes
const capacityWith32Bytes = calculateCapacity(32, false);
console.log(
  "Capacity for cell with no type script and a 32-byte data: ",
  capacityWith32Bytes.totalCKBytes + " CKBytes",
);

// IF WE CALCULATE THE CAPACITY FOR A xUDT CELL, WHICH HAS DATA CAPACITY OF 16 BYTES, THE CAPACITY SHOULD BE: 93 CKBytes
const capacityXudt = calculateCapacity(16, true);
console.log(
  "Capacity for a xUDT cell: ",
  capacityXudt.totalCKBytes + " CKBytes",
);

// IF WE CALCULATE THE CAPACITY FOR A DAO CELL, WHICH HAS DATA CAPACITY OF 8 BYTES, THE CAPACITY SHOULD BE: 93 CKBytes
const capacityDAO = calculateCapacity(8, true);
console.log("Capacity for a DAO cell: ", capacityDAO.totalCKBytes + " CKBytes");

capacityForPlainCell;
capacityWith32Bytes;
capacityXudt;
capacityDAO;
