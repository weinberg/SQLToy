// Joshua Weinberg 2020

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
CREATE TABLE employee ( id integer PRIMARY KEY, name varchar(40), salary integer, department_id integer);
CREATE TABLE department (id integer PRIMARY KEY, name varchar(40));
CREATE TABLE charity_group (id integer PRIMARY KEY, name varchar(40));
CREATE TABLE employee_charity_group (a integer references employee (id), b integer references charity_group (id));
INSERT INTO employee VALUES (1,'Josh', 150000, 1), (2,'Jane', 160000, 2), (3,'Ruth', 200000, 3), (4,'Elliot',180000, 1),(5,'Michael',120000, null), (6,'Garth',200000, null);
INSERT INTO department VALUES (1,'Sales'),(2,'Engineering'),(3,'Management'),(4,'Consultants');
INSERT INTO charity_group VALUES (1,'Cat Lovers'),(2,'House Builders'),(3,'Food for the Needy'),(4,'Environmentalists'),(5,'Education for Kids'),(6,'Hippie Music for Peace');
INSERT INTO employee_charity_group VALUES (1,1),(1,4),(2,1),(3,4),(3,5),(4,1),(4,2),(4,3),(4,4);
*/

// Helper output function
const csv = (a) => {
  a.rows.forEach((i) => delete i["_tableRows"]);
  console.log(Object.keys(a.rows[0]).join(","));
  for (i of a.rows) {
    if (i !== "_tableRows") {
      console.log(Object.values(i).join(","));
    }
  }
};

/******************
 *
 * Sample data
 *
 *****************/

const employee = {
  name: "employee",
  rows: [
    {id: 1, name: "Josh", salary: 150000, department_id: 1},
    {id: 2, name: "Jane", salary: 160000, department_id: 2},
    {id: 3, name: "Ruth", salary: 200000, department_id: 3},
    {id: 4, name: "Elliot", salary: 180000, department_id: 1},
    {id: 5, name: "Michael", salary: 120000, department_id: null},
    {id: 6, name: "Garth", salary: 200000, department_id: null},
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
 * Where takes a table and a predicate and reduces rows to the ones which match the predicate
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
