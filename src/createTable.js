/**
 * CREATE_TABLE
 */

function CREATE_TABLE(name) {
  if (global.database.tables[name]) {
    throw new Error('Table already exists');
  }

  global.database.tables[name] = {
    name,
    rows: []
  }

  return global.database.tables[name];
}

export { CREATE_TABLE }
