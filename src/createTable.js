import { database } from './index.js';

/**
 * CREATE_TABLE
 */

function CREATE_TABLE(name) {
  if (database.tables[name]) {
    throw new Error('Table already exists');
  }

  database.tables[name] = {
    name,
    rows: []
  }

  return database.tables[name];
}

export { CREATE_TABLE }
