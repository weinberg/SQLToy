/**
 * GROUP_BY creates an array for each column in the input table (which can be the result of a JOIN, WHERE)
 * and populates that array with the values for that column from rows where the group by keys are the same.
 */
import {US} from "./util.js";

const GROUP_BY = (table, groupBys) => {
  /*
  select department_id, array_agg(salary) from employees group by department_id

  make a table like:
  {
    name: employees
    rows: [
        { department_id: null,
          _groupedRows: [
            { id: 5, name: 'Michael', salary: 12000, department_id: null},
            { id: 6, name: 'Garth', salary: 13000, department_id: null},
          ]
        },
        { department_id: 3,
          _groupedValues: {
          }
        },
        { department_id: 1,
          _groupedValues: {
          }
        }

    ]
  */
  const keyRows = {};
  for (const row of table.rows) {
    // make key out of all groupby values for this row separated by unit separator
    let key = groupBys.map(groupBy => row[groupBy]).join(US);
    if (!keyRows[key]) {
      keyRows[key] = [];
    }
    keyRows[key].push({...row}); // push a copy
  }

  const resultRows = [];
  for (const key in keyRows) {
    const resultRow = {
      _groupedRows: keyRows[key]
    };
    for (const groupBy of groupBys) {
      resultRow[groupBy] = keyRows[key][0][groupBy]; // take the grouped value from the first entry in keyrows
    }
    resultRows.push(resultRow);
  }

  return {
    name: table.name,
    rows: resultRows
  }
}

export {GROUP_BY}
