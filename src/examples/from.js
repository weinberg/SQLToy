import {table} from "../output.js";
import {INNER_JOIN, LEFT_JOIN, RIGHT_JOIN} from "../join.js";
import {FROM} from "../from.js";
import {setupSampleDatabase} from "./sampleData.js";
import {initJSDB} from "../index.js";

// Demo
initJSDB();
setupSampleDatabase();
let employee;
let department;
let charity_group;
let employee_charity_group;
let result;

/***********************************/

console.log("\n-- Inner join employee, department on department id");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN department ON employee.department_id = department.id;"
);
employee = FROM('employee');
department = FROM('department');
result = INNER_JOIN( employee, department, (c) => c["employee.department_id"] === c["department.id"] );
table(result);

/***********************************/

console.log("\n-- Left join employee, department on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;"
);
employee = FROM('employee');
department = FROM('department');
result = LEFT_JOIN( employee, department, (c) => c["employee.department_id"] === c["department.id"] );
table(result);

/***********************************/

console.log("\n-- Right outer join on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee RIGHT JOIN department ON employee.department_id = department.id;"
);
employee = FROM('employee');
department = FROM('department');
result = RIGHT_JOIN( employee, department, (c) => c["employee.department_id"] === c["department.id"] );
table(result);

/***********************************/

// Join using the join table

console.log("\n-- Many to many join employee to charity group");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN employee_charity_group ON employee_charity_group.a = employee.id JOIN charity_group ON charity_group.id = employee_charity_group.b "
);
employee = FROM('employee');
department = FROM('department');
charity_group = FROM('charity_group');
employee_charity_group = FROM('employee_charity_group');
const join1 = INNER_JOIN( employee, employee_charity_group, (c) => c["employee_charity_group.A"] === c["employee.id"] );
const join2 = INNER_JOIN( join1, charity_group, (c) => c["employee_charity_group.B"] === c["charity_group.id"] );
table(join2);
