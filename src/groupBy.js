/**
 * GROUP_BY returns a new table with 1 row for each distinct set of values from the groupBys columns.
 * On those rows it also creates a _groupedRows property which holds an array of copies of the rows
 * which were grouped from the original table. This property is then used in the aggregate functions.
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
  }
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
