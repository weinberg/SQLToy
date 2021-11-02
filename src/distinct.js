/**
 * DISTINCT
 */

import {US} from "../util";

// Distinct takes a table and reduces the rows based on unique columns given
// only the columns given will be returned in the resulting table

const DISTINCT = (table, columns) => {
  const _colValuesByDistinct = {}
  for (const row of table.rows) {
    // make key out of all column values for this row separated by unit separator
    let key = columns.map(column => row[column]).join(US);
    if (!_colValuesByDistinct[key]) {
      _colValuesByDistinct[key] = {};
    }
    for (const col of columns) {
      _colValuesByDistinct[key][col] = row[col]
    }
  }

  const newRows = [];
  for (let key of Object.keys(_colValuesByDistinct)) {
    const newRow = {};
    for (let i = 0; i < columns.length; i++) {
      newRow[columns[i]] = _colValuesByDistinct[key][columns[i]]
    }
    newRows.push(newRow);
  }

  return {
    name: table.name,
    rows: newRows,
  };
}

export { DISTINCT }
