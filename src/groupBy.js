/**
 * GROUP_BY returns a new table with 1 row for each distinct set of values from the groupBys columns.
 * On those rows it also creates a _groupRows property which holds an array of copies of the rows
 * which were grouped from the original table. This property is then used in the aggregate functions.
 */
import {US} from "./util.js";

const GROUP_BY = (table, groupBys) => {
  const groupRows = {}; // hash of composite key to array of rows which are in the group
  for (const row of table.rows) {
    let key = groupBys.map(groupBy => row[groupBy]).join(US); // make composite key
    if (!groupRows[key]) {
      groupRows[key] = [];
    }
    groupRows[key].push({...row}); // push a copy
  }

  const resultRows = [];
  for (const key in groupRows) {
    const resultRow = {
      _groupRows: groupRows[key]
    };
    for (const column of groupBys) {
      resultRow[column] = groupRows[key][0][column]; // take the grouped value from the first entry in keyrows
    }
    resultRows.push(resultRow);
  }

  return {
    name: table.name,
    rows: resultRows
  }
}

export {GROUP_BY}
