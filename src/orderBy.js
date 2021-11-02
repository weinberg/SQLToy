/**
 * ORDER_BY
 */

// ORDER_BY sorts the given table using the provided relation function
// the relation function takes two rows and returns -1 if row A comes first or 1 if row B comes first

const ORDER_BY = (table, rel) => {
  return {
    name: table.name,
    rows: table.rows.sort(rel),
  }
}

export { ORDER_BY }
