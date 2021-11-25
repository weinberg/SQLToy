/**
 * DISTINCT
 */

import {US} from "./util.js";

// Distinct takes a table and reduces the rows based on unique values in the columns given.
// Only the columns given will be returned in the resulting table.

const DISTINCT = (table, columns) => {
  const _distinct = {}
  for (const row of table.rows) {
    // make composite key
    let key = columns.map(column => row[column]).join(US);
    _distinct[key] = row;
  }

  const newRows = [];
  for (let key in _distinct) {
    const newRow = {};
    for (let column of columns) {
      newRow[column] = _distinct[key][column];
    }
    newRows.push(newRow);
  }

  return {
    name: table.name,
    rows: newRows,
  };
}

export { DISTINCT }
