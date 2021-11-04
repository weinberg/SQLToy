import {table} from "../output.js";
import {INNER_JOIN, LEFT_JOIN, RIGHT_JOIN} from "../join.js";
import {charity_group, department, employee, employee_charity_group} from "./sampleData.js";

// Demo

// 1 - FROM / JOIN - Comes first in SQL operation order

console.log("\n-- Inner join employee, department on department id");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN department ON employee.department_id = department.id;"
);
const employeeDept = INNER_JOIN(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
table(employeeDept);

console.log("\n-- Left join employee, department on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;"
);
const lo = LEFT_JOIN(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
table(lo);

console.log("\n-- Right outer join on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee RIGHT JOIN department ON employee.department_id = department.id;"
);
const ro = RIGHT_JOIN(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);
table(ro);

/*
Join using the join table
*/

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
table(join2);
