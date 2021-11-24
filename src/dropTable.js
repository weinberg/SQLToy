import { database } from './index.js'

function DROP_TABLE(tableName) {
  delete database.tables[tableName];
}

export { DROP_TABLE };
