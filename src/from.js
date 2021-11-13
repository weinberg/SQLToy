import { database } from './index.js';
import {CROSS_JOIN} from "./join.js";

function FROM(tableNames) {
  // just a tablename
  if (!Array.isArray(tableNames)) {
    return database.tables[tableNames];
  }
  // array of tablenames
  if (tableNames.length === 1) {
    return database.tables[tableNames[0]];
  }
  // recursively cross join on multiple tables
  return CROSS_JOIN(database.tables[tableNames[0]], FROM(tableNames.slice(1)));
}

export { FROM }
