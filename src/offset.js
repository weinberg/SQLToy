/**
 * OFFSET
 */

// OFFSET skips the number of rows before returning results

const OFFSET = (table, offset) => {
  return {
    name: table.name,
    rows: table.rows.slice(offset),
  }
}

export { OFFSET }
