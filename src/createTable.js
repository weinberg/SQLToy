import { database } from './index.js';

/**
 * CREATE_TABLE
 */

function CREATE_TABLE(name) {
  database.tables[name] = {
    name,
    rows: []
  }

  return database.tables[name];
}

export { CREATE_TABLE }
