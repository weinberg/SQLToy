// AGGREGATE FUNCTIONS

const aggregateHelper = (table, column, aggName, aggFunc) => {
  for (const row of table.rows) {
    row[`${aggName}(${column})`] = aggFunc(row._groupedValues[column]);
  }
  return table;
}

// ARRAY_AGG returns a table with a new aggregate column for the given grouped column
// which just contains the list of the grouped values
const ARRAY_AGG = (table, column) => {
  return aggregateHelper(table, column, 'ARRAY_AGG', values => values);
}

// AVG returns a table with a new aggregate column for the given grouped column
// which contains the average of the grouped values
const AVG = (table, column) => {
  return aggregateHelper(table, column, 'AVG', values => {
    const total = values.reduce((p, c) => p + c, 0);
    return total / values.length;
  });
}

// MAX aggregate function
const MAX = (table, column) => {
  const getMax = (a, b) => Math.max(a, b);
  return aggregateHelper(table, column, 'MAX', values => values.reduce(getMax));
}

// MIN aggregate function
const MIN = (table, column) => {
  const getMin = (a, b) => Math.min(a, b);
  return aggregateHelper(table, column, 'MIN', values => values.reduce(getMin));
}

// COUNT aggregate function
const COUNT = (table, column) => {
  return aggregateHelper(table, column, 'COUNT', values => values.length);
}

export {
  ARRAY_AGG,
  AVG,
  COUNT,
  MAX,
  MIN
}
