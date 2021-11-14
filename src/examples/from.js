import {table} from "../output.js";
import {CROSS_JOIN, INNER_JOIN, LEFT_JOIN, RIGHT_JOIN} from "../join.js";
import {FROM} from "../from.js";
import {setupSampleDatabase} from "./sampleData.js";
import {initJSDB} from "../index.js";
import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";
import {SELECT} from "../select.js";

// Demo
initJSDB();
setupSampleDatabase();
let employee;
let department;
let charity_group;
let employee_charity_group;
let result;

/***********************************/

/*
let test1 = CREATE_TABLE('test1');
let test2 = CREATE_TABLE('test2');
INSERT_INTO('test1',{ c: 'A' });
INSERT_INTO('test1',{ c: 'B' });
INSERT_INTO('test2',{ c: '1' });
INSERT_INTO('test2',{ c: '2' });

// manually doing cross join
result = CROSS_JOIN(test1, test2);
result = SELECT(CROSS_JOIN(test1,test2), ['test1.c','test2.c'])
table(result);

// giving multiple tables to FROM
result = FROM(['test1', 'test2']);
table(result);

let test3 = CREATE_TABLE('test3');
INSERT_INTO('test3',{ c: 'X' });
INSERT_INTO('test3',{ c: 'Y' });
result = FROM(['test1', 'test2', 'test3']);
table(result);
process.exit();
*/

/***********************************/

console.log("\n-- Inner join employee, department on department id");
console.log(
  "-- Equivalent SQL: SELECT * FROM employee JOIN department ON employee.department_id = department.id;"
);
employee = FROM('employee');
department = FROM('department');
result = INNER_JOIN( employee, department, (c) => c["employee.department_id"] === c["department.id"] );
table(result);
process.exit();

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
