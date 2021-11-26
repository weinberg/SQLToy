// SELECT * FROM employee JOIN department ON department.id = employee.id WHERE salary > 150000
// First do an inner join on employee and department
import {INNER_JOIN} from "../join.js";
import {WHERE} from "../where.js";
import {table} from "../output.js";
import {setupDatabase} from "./sampleData.js";
import {initSQLToy} from "../index.js";
import {FROM} from "../from.js";
import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";

initSQLToy();
setupDatabase();
let employee;
let department;
let result;
let employee_club;
let club;

employee = FROM('employee');
result = WHERE(employee, (c) => c["department_id"] === 1);
table(result);

employee = FROM('employee');
department = FROM('department');
result = INNER_JOIN(employee, department, (c) => c["employee.department_id"] === c["department.id"]);
result = WHERE(result, (row) => {
  return row['employee.salary'] > 150000;
});
table(result);

/*
┌─────────────┬───────────────┬─────────────────┬────────────────────────┬─────────────────┬───────────────┬─────────────────┐
│ employee.id │ employee.name │ employee.salary │ employee.department_id │ employee.status │ department.id │ department.name │
├─────────────┼───────────────┼─────────────────┼────────────────────────┼─────────────────┼───────────────┼─────────────────┤
│      2      │     Jane      │     160000      │           2            │     active      │       2       │   Engineering   │
│      3      │     Ruth      │     200000      │           1            │    inactive     │       1       │      Sales      │
│      4      │    Elliot     │     180000      │           1            │     active      │       1       │      Sales      │
└─────────────┴───────────────┴─────────────────┴────────────────────────┴─────────────────┴───────────────┴─────────────────┘
*/

// SELECT * FROM employee
//  JOIN employee_club ON employee_club.a = employee.id
//  JOIN club ON club.id = employee_club.b
//  WHERE salary > 150000 AND club.name = 'Cat Lovers';

employee = FROM('employee');
department = FROM('department');
employee_club = FROM('employee_club');
club = FROM('club');
result = INNER_JOIN(employee, employee_club, (c) => c["employee_club.A"] === c["employee.id"]);
result = INNER_JOIN(result, club, (c) => c["employee_club.B"] === c["club.id"]);
table(result);
result = WHERE(result, (row) => {
  return row['employee.salary'] > 150000 && row['club.name'] === 'Cat Lovers';
});
table(result);

/*
┌─────────────┬───────────────┬─────────────────┬────────────────────────┬─────────────────┬──────────────────────────┬──────────────────────────┬──────────────────┬────────────────────┐
│ employee.id │ employee.name │ employee.salary │ employee.department_id │ employee.status │ employee_club.A │ employee_club.B │ club.id │ club.name │
├─────────────┼───────────────┼─────────────────┼────────────────────────┼─────────────────┼──────────────────────────┼──────────────────────────┼──────────────────┼────────────────────┤
│      2      │     Jane      │     160000      │           2            │     active      │            2             │            1             │        1         │     Cat Lovers     │
│      4      │    Elliot     │     180000      │           1            │     active      │            4             │            1             │        1         │     Cat Lovers     │
└─────────────┴───────────────┴─────────────────┴────────────────────────┴─────────────────┴──────────────────────────┴──────────────────────────┴──────────────────┴────────────────────┘
*/

CREATE_TABLE('test1');
INSERT_INTO('test1', {id: 1, name: 'Josh', test_2_id: 1});
CREATE_TABLE('test2');
INSERT_INTO('test2', {id: 1, name: 'Engineering', test_3_id: 1});
CREATE_TABLE('test3');
INSERT_INTO('test3', {id: 1, name: 'First Floor', test_3_id: 1});
debugger;
let test1 = FROM('test1');
let test2 = FROM('test2');
let test3 = FROM('test3');
result = INNER_JOIN(test1, test2, (c) => c["test1.test_2_id"] === c["test2.id"]);
table(result);
result = INNER_JOIN(result, test3, (c) => c["test2.test_3_id"] === c["test3.id"]);
table(result);
