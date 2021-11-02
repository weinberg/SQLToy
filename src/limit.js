/**
 * LIMIT
 */

// LIMIT returns the number of rows specified

const LIMIT = (table, limit) => {
  return {
    name: table.name,
    rows: table.rows.slice(0, limit),
  }
}

export { LIMIT }
