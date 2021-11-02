/**
 * select
 */

// select just picks columns from the provided table and optionally renames the columns
// aliases are a map of {column:alias}
const SELECT = (table, columns, aliases = {}) => {
  const newrows = [];

  const colnames = {};

  for (const col of columns) {
    colnames[col] = aliases[col] ? aliases[col] : col;
  }

  for (const row of table.rows) {
    const newrow = {};
    for (let column of columns) {
      newrow[colnames[column]] = row[column];
    }
    newrows.push(newrow);
  }

  return {
    name: table.name,
    rows: newrows,
  };
}


export { SELECT }
