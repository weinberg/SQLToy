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
      for (const k in x) {
        const columnName = a.name ? `${a.name}.${k}` : k;
        row[columnName] = x[k];
      }

      // for each column in b, create a column in the ouput
      for (const k in y) {
        const columnName = b.name ? `${b.name}.${k}` : k;
        row[columnName] = y[k];
      }

      // Store an array of the two rows used to make up this new row.
      // This is used in LEFT_JOIN and RIGHT_JOIN.
      row._tableRows = [x, y];

      result.rows.push(row);
    }
  }
  return result;
};

/**
 * innerJoin takes two tables and a predicate. Result will be a table which includes the cross join of all rows which satisfy the predicate.
 * todo: support aliases where we can pass in a value to use for columnName (in the cross join)
 */
const INNER_JOIN = (a, b, pred) => {
  return {
    name: '',
    rows: CROSS_JOIN(a, b).rows.filter(pred),
  }
};

/**
 * leftJoin takes two tables and a predicate. Result will be a table which includes all rows from the cross join which satisfy the predicate or in the case where no rows in b match for a row in a, a row with the values for b set to null.
 */
const LEFT_JOIN = (a, b, pred) => {
  // Start by taking the cross join of a,b and creating a result table.
  const cp = CROSS_JOIN(a, b);
  let result = {
    name: '',
    rows: [],
  }

  // for each row in a either return matching rows from the cross product
  // or a row with nulls for b if there are no matches
  for (let aRow of a.rows) {
    // find all rows in cross product which come from this row in table a using the _tableRows array
    const cpa = cp.rows.filter((cpr) => cpr._tableRows.includes(aRow));

    // apply the filter
    const match = cpa.filter(pred);

    if (match.length) {
      // we found at least one match so add to result rows
      result.rows.push(...match);
    } else {
      // we did not find a match so create a row with values from a and nulls for b

      let aValues = {};
      let bValues = {};

      // values from a
      for (const key in aRow) {
        aValues[`${a.name}.${key}`] = aRow[key];
      }

      // nulls for b
      for (const key in b.rows[0]) {
        bValues[`${b.name}.${key}`] = null;
      }

      result.rows.push({...aValues, ...bValues});
    }
  }

  return result;
};

/**
 * rightJoin takes two tables and a predicate. Result will be a table which includes the cross join of all rows which satisfy the predicate and which has no nulls in table b.
 */
const RIGHT_JOIN = (a, b, pred) => {
  return LEFT_JOIN(b, a, pred);
};

export { INNER_JOIN as JOIN, CROSS_JOIN, INNER_JOIN, LEFT_JOIN, RIGHT_JOIN }
