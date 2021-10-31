// Joshua Weinberg 2020

const US = String.fromCharCode(0x1f); // unitSeparator

// cross takes two tables and returns a table which includes a cross join of all rows
const CROSS_JOIN = (a, b) => {
  const result = {
    name: '',
    rows: []
  }
  for (const x of a.rows) {
    for (const y of b.rows) {
      const row = {};
      for (const k of Object.keys(x)) {
        const columnName = a.name ? `${a.name}.${k}` : k;
        row[columnName] = x[k];
      }
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

// return true if all key/values of a are in b
const rowMatch = (a, b) => {
  return Object.keys(a).every((k) => a[k] === b[k]);
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
 * innerJoin takes two tables and a predicate. Result will be a table which includes the cross join of all rows which satisfy the predicate and have no null elements.
 */
const INNER_JOIN = (a, b, pred) => {
  const result = {
    name: '',
    rows: CROSS_JOIN(a, b).rows.filter(pred),
  }

  return result;
};

/**
 * leftJoin takes two tables and a predicate. Result will be a table which includes the cross join of all rows which satisfy the predicate and which has no nulls in table a.
 */
const LEFT_JOIN = (a, b, pred) => {
  const cp = CROSS_JOIN(a, b);
  let result = {
    name: '',
  }
  let rows = []
  for (i of a.rows) {
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

/*
To test these queries in postgres:
CREATE TABLE employee ( id integer PRIMARY KEY, name varchar(40), salary integer, department_id integer, status varchar(40));
CREATE TABLE department (id integer PRIMARY KEY, name varchar(40));
CREATE TABLE charity_group (id integer PRIMARY KEY, name varchar(40));
CREATE TABLE employee_charity_group (a integer references employee (id), b integer references charity_group (id));
INSERT INTO employee VALUES (1,'Josh', 150000, 1, 'inactive'), (2,'Jane', 160000, 2, 'active'), (3,'Ruth', 200000, 1, 'inactive'), (4,'Elliot',180000, 1, 'active'),(5,'Michael',120000, null, 'active'), (6,'Garth',200000, null, 'active');
INSERT INTO department VALUES (1,'Sales'),(2,'Engineering'),(3,'Management'),(4,'Consultants');
INSERT INTO charity_group VALUES (1,'Cat Lovers'),(2,'House Builders'),(3,'Food for the Needy'),(4,'Environmentalists'),(5,'Education for Kids'),(6,'Hippie Music for Peace');
INSERT INTO employee_charity_group VALUES (1,1),(1,4),(2,1),(3,4),(3,5),(4,1),(4,2),(4,3),(4,4);
*/

// Helper output function
const csv = (a) => {
  a.rows.forEach((i) => delete i["_tableRows"]);
  a.rows.forEach((i) => delete i["_groupedValues"]);
  console.log(Object.keys(a.rows[0]).join(','));
  for (i of a.rows) {
    const outputValues = [];
    for (value of Object.values(i)) {
      if (value === '') {
        outputValues.push('<null>');
      } else if (Array.isArray(value)) {
        outputValues.push(`"[${value.join(',')}]"`)
      } else {
        outputValues.push(value);
      }
    }
    console.log(outputValues.join(','));
  }
};

const table = (a) => {
  a.rows.forEach((i) => delete i["_tableRows"]);
  a.rows.forEach((i) => delete i["_groupedValues"]);
  const out = [];
  for (r of a.rows) {
    out.push(r);
  }
  console.table(out);
}

/******************
 *
 * Sample data
 *
 *****************/

const employee = {
  name: "employee",
  rows: [
    {id: 1, name: "Josh", salary: 150000, department_id: 1, status: 'inactive',},
    {id: 2, name: "Jane", salary: 160000, department_id: 2, status: 'active',},
    {id: 3, name: "Ruth", salary: 200000, department_id: 1, status: 'inactive',},
    {id: 4, name: "Elliot", salary: 180000, department_id: 1, status: 'active',},
    {id: 5, name: "Michael", salary: 120000, department_id: null, status: 'active',},
    {id: 6, name: "Garth", salary: 200000, department_id: null, status: 'active',},
  ],
};

const department = {
  name: "department",
  rows: [
    {id: 1, name: "Sales"},
    {id: 2, name: "Engineering"},
    {id: 3, name: "Management"},
    {id: 4, name: "Consultants"},
  ],
};

const charity_group = {
  name: "charity_group",
  rows: [
    {id: 1, name: "Cat Lovers"},
    {id: 2, name: "House Builders"},
    {id: 3, name: "Food for the Needy"},
    {id: 4, name: "Environmentalists"},
    {id: 5, name: "Education for Kids"},
    {id: 6, name: "Hippie Music for Peace"},
  ],
}

// join table for many-to-many relation between employee and charity_group
// employees can be in zero or more groups
// groups can have zero or more employees
const employee_charity_group = {
  name: "employee_charity_group",
  rows: [
    {A: 1, B: 1}, // Josh - Cat Lovers
    {A: 1, B: 4}, // Josh - Environmentalists
    {A: 2, B: 1}, // Jane - Cat lovers
    {A: 3, B: 4}, // Ruth - Environmentalists
    {A: 3, B: 5}, // Ruth - Education for kids
    {A: 4, B: 1}, // Elliot - Cat Lovers
    {A: 4, B: 2}, // Elliot - House Builders
    {A: 4, B: 3}, // Elliot - Food for the Needy
    {A: 4, B: 4}, // Elliot - Environmentalists
  ],
}

// Demo

// 1 - FROM / JOIN - Comes first in SQL operation order

/*
console.log("\n-- Inner join employee, department on department id");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN department ON employee.department_id = department.id;"
);
const employeeDept = INNER_JOIN(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
csv(employeeDept);

console.log("\n-- Left join employee, department on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;"
);
const lo = LEFT_JOIN(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
csv(lo);

console.log("\n-- Right outer join on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee RIGHT JOIN department ON employee.department_id = department.id;"
);
const ro = RIGHT_JOIN(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
csv(ro);
*/

/*
Join using the join table
*/

/*
console.log("\n-- Many to many join employee to charity group");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN employee_charity_group ON employee_charity_group.a = employee.id JOIN charity_group ON charity_group.id = employee_charity_group.b "
);
const join1 = INNER_JOIN(
  employee,
  employee_charity_group,
  (c) => c["employee_charity_group.A"] === c["employee.id"]
);
const join2 = INNER_JOIN(
  join1,
  charity_group,
  (c) => c["employee_charity_group.B"] === c["charity_group.id"]
);
csv(join2);
*/

// 2 - WHERE - where is run after a FROM/JOIN to reduce the output set

/**
 * WHERE takes a table and a predicate and reduces rows to the ones which match the predicate
 */
const WHERE = (table, pred) => {
  return {
    name: table.name,
    rows: table.rows.filter(pred)
  };
}

// SELECT * FROM employee JOIN department ON department.id = employee.id WHERE salary > 150000
// First do an inner join on employee and department
/*
const employeeDept = INNER_JOIN(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);

// then apply the WHERE clause
const result = WHERE(employeeDept, (row) => {
  return row['employee.salary'] > 150000;
});
csv(result);
 */

// SELECT * FROM employee
//  JOIN employee_charity_group ON employee_charity_group.a = employee.id
//  JOIN charity_group ON charity_group.id = employee_charity_group.b
//  WHERE salary > 150000 AND charity_group.name = 'Cat Lovers';
// First do join via join table as above
/*
const join1 = INNER_JOIN(
  employee,
  employee_charity_group,
  (c) => c["employee_charity_group.A"] === c["employee.id"]
);
const join2 = INNER_JOIN(
  join1,
  charity_group,
  (c) => c["employee_charity_group.B"] === c["charity_group.id"]
);
// Then apply the WHERE clause
const result = WHERE(join2, (row) => {
  return row['employee.salary'] > 150000 && row['charity_group.name'] === 'Cat Lovers';
});
csv(result);
*/

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
const GROUP_BY = (table, groupBys) => {
  _colValuesByGroupBy = {}

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
    const total = values.reduce((p,c) => p + c, 0);
    return total/values.length;
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

//console.log('SELECT department_id, array_agg(salary) FROM employee GROUP BY department_id');

/*
let group = GROUP_BY(employee, 'department_id');
const agg = ARRAY_AGG(group, 'salary');
debugger;
csv(agg)
*/

// console.log('SELECT department_id, avg(salary) FROM employee GROUP BY department_id');
/*
group = GROUP_BY(employee, 'department_id');
const avgs = AVG(group, 'salary');
csv(avgs)
*/

// Two aggregate columns:
// console.log('SELECT department_id, avg(salary), array_agg(salary) FROM employee GROUP BY department_id');
/*
let result = GROUP_BY(employee, 'department_id');
result = ARRAY_AGG(result, 'salary');
result = AVG(result, 'salary');
result = MAX(result, 'salary');
result = MIN(result, 'salary');
result = COUNT(result, 'salary');
csv(result)
 */

/*
result:
   department_id | ARRAY_AGG(salary) | AVG(salary) | MAX(salary) | MIN(salary) | COUNT(salary) ║
   1             | [150000,180000]   | 165000      | 180000      | 150000      | 2             ║
   2             | [160000]          | 160000      | 160000      | 160000      | 1             ║
   3             | [200000]          | 200000      | 200000      | 200000      | 1             ║
   null          | [120000,200000]   | 160000      | 200000      | 120000      | 2             ║
*/

/**
 * HAVING
 */

// Having takes an aggregate function and a predicate
// todo

/**
 * WINDOW
 */

// todo

/**
 * SELECT
 */

// Select just picks columns from the provided table and optionally renames the columns
// aliases are a map of {column:alias}
const SELECT = (table, columns, aliases = {}) => {
  const newRows = [];

  const colNames = {};

  for (const col of columns) {
    colNames[col] = aliases[col] ? aliases[col] : col;
  }

  for (const row of table.rows) {
    const newRow = {};
    for (column of columns) {
      newRow[colNames[column]] = row[column];
    }
    newRows.push(newRow);
  }

  return {
    name: table.name,
    rows: newRows,
  };
}

/*
let result = GROUP_BY(employee, ['department_id', 'status']);
result = ARRAY_AGG(result, 'name');
result = MAX(result, 'salary');
result = COUNT(result);
const sel = SELECT(result, ['department_id','status','ARRAY_AGG(name)','MAX(salary)','COUNT()']);
table(sel);
*/


/**
 * DISTINCT
 */

// Distinct takes a table and reduces the rows based on unique columns given
// only the columns given will be returned in the resulting table

const DISTINCT = (table, columns) => {
  const _colValuesByDistinct = {}
  for (const row of table.rows) {
    // make key out of all column values for this row separated by unit separator
    let key = columns.map(column => row[column]).join(US);
    if (!_colValuesByDistinct[key]) {
      _colValuesByDistinct[key] = {};
    }
    for (const col of columns) {
      _colValuesByDistinct[key][col] = row[col]
    }
  }

  debugger;
  const newRows = [];
  for (key of Object.keys(_colValuesByDistinct)) {
    const newRow = {};
    for (let i = 0; i < columns.length; i++) {
      newRow[columns[i]] = _colValuesByDistinct[key][columns[i]]
    }
    newRows.push(newRow);
  }

  return {
    name: table.name,
    rows: newRows,
  };
}

// demo distinct
/*
const sel = SELECT(employee, ['status','name']);
const d = DISTINCT(sel, ['status','name']);
table(d);
*/

// This query joins on charity_group and then does distinct on status and charity_group.name
// which leads to (active, Cat Lovers) and (inactive, Environmentalists) being condensed to a single row
// SELECT distinct status, charity_group.name, COUNT(*) AS count FROM employee
// JOIN employee_charity_group ON employee_charity_group.a = employee.id
// JOIN charity_group ON charity_group.id = employee_charity_group.b
// GROUP BY status, charity_group.name

/*
Result:
┌─────────┬─────────────────┬──────────────────────┬───────┐
│ (index) │ employee.status │  charity_group.name  │ count │
├─────────┼─────────────────┼──────────────────────┼───────┤
│    0    │   'inactive'    │     'Cat Lovers'     │   1   │
│    1    │   'inactive'    │ 'Environmentalists'  │   2   │
│    2    │    'active'     │     'Cat Lovers'     │   2   │
│    3    │   'inactive'    │ 'Education for Kids' │   1   │
│    4    │    'active'     │   'House Builders'   │   1   │
│    5    │    'active'     │ 'Food for the Needy' │   1   │
│    6    │    'active'     │ 'Environmentalists'  │   1   │
└─────────┴─────────────────┴──────────────────────┴───────┘
 */

// First do join via join table as above
/*
result = INNER_JOIN(
  employee,
  employee_charity_group,
  (c) => c["employee_charity_group.A"] === c["employee.id"]
);
result = INNER_JOIN(
  result,
  charity_group,
  (c) => c["employee_charity_group.B"] === c["charity_group.id"]
);
// then Group By and aggregates

result = GROUP_BY(result, ['employee.status', 'charity_group.name']);
result = COUNT(result, 'charity_group.name');

// then apply SELECT
result = SELECT(result, ['employee.status', 'charity_group.name','COUNT(charity_group.name)'],{'COUNT(charity_group.name)': 'count'})
table(result);
*/

/**
 * ORDER_BY
 */

// ORDER_BY sorts the given table using the provided relation function
// the relation function takes two rows and returns -1 if row A comes first or 1 if row B comes first

const ORDER_BY = (table, rel) => {
  return {
    name: table.name,
    rows: table.rows.sort(rel),
  }
}

// order by name
/*
result = SELECT(employee, ['name', 'status']);
result = ORDER_BY(result, (a,b) => {
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
});
table(result);

// order by status
result = SELECT(employee, ['name', 'status']);
result = ORDER_BY(result, (a,b) => {
  if (a.status < b.status) {
    return -1;
  } else {
    return 1;
  }
});
table(result);
*/

/**
 * OFFSET
 */

// OFFSET skips the number of rows before returning results

const OFFSET = (table, offset) => {
  return {
    name: table.name,
    rows: table.rows.slice(offset),
  }
}

/*
result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
result = OFFSET(result, 2);
table(result);
*/

/**
 * LIMIT
 */

// LIMIT returns the number of rows specified

const LIMIT = (table, limit) => {
  return {
    name: table.name,
    rows: table.rows.slice(0, limit),
  }
}

/*
result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
result = LIMIT(result, 4);
table(result);
*/

// OFFSET and LIMIT used together paginate data

result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
let off = OFFSET(result, 0);
let page = LIMIT(off, 4);
table(page);
off = OFFSET(result, 4);
page = LIMIT(off, 4);
table(page);









