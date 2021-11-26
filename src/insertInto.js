import { database } from './index.js';

function INSERT_INTO(tableName, r) {
  let rows;
  if (Array.isArray(r)) {
    rows = r;
  } else {
    rows = [r];
  }
  const table = database.tables[tableName];
  for (const row of rows) {
    table.rows = [...table.rows, row];
  }
}

export { INSERT_INTO }
