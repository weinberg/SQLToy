import {table} from "../output.js";
import {CROSS_JOIN, INNER_JOIN, LEFT_JOIN, RIGHT_JOIN} from "../join.js";
import {FROM} from "../from.js";
import {setupDatabase} from "./sampleData.js";
import {initSQLToy} from "../index.js";
import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";
import {SELECT} from "../select.js";
import {ORDER_BY} from "../orderBy.js";

// Demo
initSQLToy();
setupDatabase();
let employee;
let department;
let club;
let employee_club;
let result;

/***********************************/

let test1 = CREATE_TABLE('test1');
let test2 = CREATE_TABLE('test2');
INSERT_INTO('test1', {c: 'A'});
INSERT_INTO('test1', {c: 'B'});
INSERT_INTO('test2', {c: '1'});
INSERT_INTO('test2', {c: '2'});

// manually doing cross join
result = CROSS_JOIN(test1, test2);
result = SELECT(CROSS_JOIN(test1, test2), ['test1.c', 'test2.c'])
table(result);

// giving multiple tables to FROM
result = FROM(['test1', 'test2']);
table(result);

let test3 = CREATE_TABLE('test3');
INSERT_INTO('test3', {c: 'X'});
INSERT_INTO('test3', {c: 'Y'});
result = FROM(['test1', 'test2', 'test3']);
table(result);

/***********************************/

console.log("\n-- Inner join employee, department on department id");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN department ON employee.department_id = department.id;"
);
employee = FROM('employee');
department = FROM('department');
result = INNER_JOIN(employee, department, (c) => c["employee.department_id"] === c["department.id"]);
table(result);

/***********************************/

console.log("\n-- Left join employee, department on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;"
);
employee = FROM('employee');
department = FROM('department');
result = LEFT_JOIN(employee, department, (c) => c["employee.department_id"] === c["department.id"]);
table(result);

/***********************************/

console.log("\n-- Right outer join on department id --");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee RIGHT JOIN department ON employee.department_id = department.id;"
);
employee = FROM('employee');
department = FROM('department');
result = RIGHT_JOIN(employee, department, (c) => c["employee.department_id"] === c["department.id"]);
table(result);

/***********************************/

// Join using the join table

console.log("\n-- Many to many join employee to charity group");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN employee_club ON employee_club.a = employee.id JOIN club ON club.id = employee_club.b "
);
employee = FROM('employee');
club = FROM('club');
employee_club = FROM('employee_club');
result = INNER_JOIN(employee, employee_club, (c) => c["employee_club.A"] === c["employee.id"]);
result = INNER_JOIN(result, club, (c) => c["employee_club.B"] === c["club.id"]);
result = SELECT(result, ['employee.name', 'club.name']);
result = ORDER_BY(result, (a, b) => a['employee.name'].localeCompare(b['employee.name']));
table(result);
