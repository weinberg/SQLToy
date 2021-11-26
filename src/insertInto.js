import { database } from './index.js';

function INSERT_INTO(tableName, r) {
  let rows;
  if (Array.isArray(r)) {
    rows = r;
  } else {
    rows = [r];
  }
  const table = database.tables[tableName];
  table.rows = [...table.rows, ...rows];
}

export { INSERT_INTO }
