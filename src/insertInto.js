function INSERT_INTO(tableName, row) {
  const table = global.database.tables[tableName];
  if (!table) {
    throw new Error('Table not found');
  }
  table.rows = [...table.rows, row];
}

export { INSERT_INTO }
