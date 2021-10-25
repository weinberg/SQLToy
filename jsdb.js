/*
Test in postgres:
CREATE TABLE employee ( id integer PRIMARY KEY, name varchar(40), department_id integer);
CREATE TABLE department (id integer PRIMARY KEY, name varchar(40));
INSERT INTO employee VALUES (1,'Josh', 1), (2,'Jane', 2), (3,'Ruth', 3), (4,'Elliot',1),(5,'Michael',null), (6,'Garth',null);
INSERT INTO department VALUES (1,'Sales'),(2,'Engineering'),(3,'Management'),(4,'Consultants');
*/

const employee = {
  name: "employee",
  rows: [
    { id: 1, name: "Josh", department_id: 1 },
    { id: 2, name: "Jane", department_id: 2 },
    { id: 3, name: "Ruth", department_id: 3 },
    { id: 4, name: "Elliot", department_id: 1 },
    { id: 5, name: "Michael", department_id: null },
    { id: 6, name: "Garth", department_id: null },
  ],
};

const department = {
  name: "department",
  rows: [
    { id: 1, name: "Sales" },
    { id: 2, name: "Engineering" },
    { id: 3, name: "Management" },
    { id: 4, name: "Consultants" },
  ],
};

// cross product
const cross = (a, b) => {
  const results = [];
  for (const x of a.rows) {
    for (const y of b.rows) {
      const row = {};
      for (const k of Object.keys(x)) {
        row[`${a.name}.${k}`] = x[k];
      }
      for (const k of Object.keys(y)) {
        row[`${b.name}.${k}`] = y[k];
      }
      row._tableRows = [x, y];
      results.push(row);
    }
  }
  return results;
};

const innerJoin = (a, b, pred) => {
  return cross(a, b).filter(pred);
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

const leftOuterJoin = (a, b, pred) => {
  const cp = cross(a, b);
  let results = [];
  for (i of a.rows) {
    const cpa = cp.filter((cpr) => cpr._tableRows.includes(i));
    const match = cpa.filter(pred);
    if (match.length) {
      // we found a match so add to results table
      results = [...results, ...match];
    } else {
      // we did not find a match so add a record with values from a and values of null for b
      results.push({ ...getResultRow(a.name, i), ...nullValues(b) });
    }
  }
  return results;
};

const rightOuterJoin = (a, b, pred) => {
  return leftOuterJoin(b, a, pred);
};

const csv = (a) => {
  a.forEach((i) => delete i["_tableRows"]);
  console.log(Object.keys(a[0]).join(","));
  for (i of a) {
    if (i !== "_tableRows") {
      console.log(Object.values(i).join(","));
    }
  }
};

console.log("\n-- Inner join employee, department on department id");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN department ON employee.department_id = department.id;"
);
const employeeDept = innerJoin(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
csv(employeeDept);

console.log("\n-- Left join employee, department on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;"
);
const lo = leftOuterJoin(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
csv(lo);

console.log("\n-- Right outer join on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee RIGHT JOIN department ON employee.department_id = department.id;"
);
const ro = rightOuterJoin(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
csv(ro);
