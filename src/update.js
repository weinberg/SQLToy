/**
 * UPDATE
 */

// set is an object with key/values to set
function UPDATE(table, set, pred) {
  return {
    name: table.name,
    rows: table.rows.map(row => {
      if (pred(row)) {
        const newRow = {...row};
        for (const key of Object.keys(set)) {
          newRow[key] = set[key];
        }
        return newRow;
      } else {
        return row;
      }
    })
  }
}

export { UPDATE }
