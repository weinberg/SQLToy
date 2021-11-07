function FROM(tableName) {
  return global.database.tables[tableName];
}

export { FROM }
