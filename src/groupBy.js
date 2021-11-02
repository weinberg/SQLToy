/**
 * GROUP_BY creates an array for each column in the input table (which can be the result of a JOIN, WHERE)
 * and populates that array with the values for that column from rows where the group by key is the same.
 */
/*
   select department_id, array_agg(salary) from employees group by department_id

   need to make table like:

   {
    name: employees
    rows: [
      { department_id: null,
        _groupedValues: {
          salary: [ 120000, 200000 ],
          name: ['Michael', 'Garth' ],
          id: [5,6],
          department_id: [None, None],
        }
      },
      { department_id: 3,
        _groupedValues: {
          salary: [ 200000 ],
          name: ['Ruth' ],
          id: [3],
          department_id: [3],
        }
      },
      { department_id: 1,
        _groupedValues: {
          salary: [ 150000, 180000 ],
          name: ['Josh', 'Elliot'],
          id: [1,4],
          department_id: [1,1],
        }
      }
    ]
   }
 */
import {US} from "./util.js";

const GROUP_BY = (table, groupBys) => {
  const _colValuesByGroupBy = {}

  for (const row of table.rows) {
    // make key out of all groupby values for this row separated by unit separator
    let key = groupBys.map(groupBy => row[groupBy]).join(US);
    if (!_colValuesByGroupBy[key]) {
      _colValuesByGroupBy[key] = {};
    }
    for (const col of Object.keys(row)) {
      if (!_colValuesByGroupBy[key][col]) {
        _colValuesByGroupBy[key][col] = [];
      }
      _colValuesByGroupBy[key][col].push(row[col])
    }
  }

  const resultRows = [];
  for (const key of Object.keys(_colValuesByGroupBy)) {
    const r = {
      _groupedValues: _colValuesByGroupBy[key]
    }
    const values = key.split(US);
    for (let i = 0; i < groupBys.length; i++) {
      r[groupBys[i]] = values[i];
    }
    resultRows.push(r);
  }

  return {
    name: table.name,
    rows: resultRows
  }
}

export { GROUP_BY }
