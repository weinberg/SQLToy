// cross takes two tables and returns a table which includes a cross join of all rows
const CROSS_JOIN = (a, b) => {
  const result = {
    name: '',
    rows: []
  }
  for (const x of a.rows) { // loop over rows in table a
    for (const y of b.rows) { // loop over rows in table b
      const row = {};

      // for each column in a, create a column in the ouput
      for (const k of Object.keys(x)) {
        const columnName = a.name ? `${a.name}.${k}` : k;
        row[columnName] = x[k];
      }

      // for each column in b, create a column in the ouput
      for (const k of Object.keys(y)) {
        const columnName = b.name ? `${b.name}.${k}` : k;
        row[columnName] = y[k];
      }

      row._tableRows = [x, y];
      result.rows.push(row);
    }
  }
  return result;
};

// returns object with null column for all columns of a
const nullValues = (a) => {
  const result = {};
  for (const k in a.rows[0]) {
    result[`${a.name}.${k}`] = null;
  }
  return result;
};

const getResultRow = (name, a) => {
  const row = {};
  for (const k of Object.keys(a)) {
    row[`${name}.${k}`] = a[k];
  }
  return row;
};

/**
 * innerJoin takes two tables and a predicate. Result will be a table which includes the cross join of all rows which satisfy the predicate.
 */
const INNER_JOIN = (a, b, pred) => {
  return {
    name: '',
    rows: CROSS_JOIN(a, b).rows.filter(pred),
  }
};

/**
 * leftJoin takes two tables and a predicate. Result will be a table which includes the cross join of all rows which satisfy the predicate or are from table a (with table b columns set to null).
 */
const LEFT_JOIN = (a, b, pred) => {
  const cp = CROSS_JOIN(a, b);
  let result = {
    name: '',
  }
  let rows = []
  for (let i of a.rows) {
    const cpa = cp.rows.filter((cpr) => cpr._tableRows.includes(i));
    const match = cpa.filter(pred);
    if (match.length) {
      // we found a match so add to results table
      rows = [...rows, ...match];
    } else {
      // we did not find a match so add a record with values from a and values of null for b
      rows.push({...getResultRow(a.name, i), ...nullValues(b)});
    }
  }
  result.rows = rows;
  return result;
};

/**
 * rightJoin takes two tables and a predicate. Result will be a table which includes the cross join of all rows which satisfy the predicate and which has no nulls in table b.
 */
const RIGHT_JOIN = (a, b, pred) => {
  return LEFT_JOIN(b, a, pred);
};

export { INNER_JOIN as JOIN, CROSS_JOIN, INNER_JOIN, LEFT_JOIN, RIGHT_JOIN }
