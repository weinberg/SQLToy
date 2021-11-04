// SELECT * FROM employee JOIN department ON department.id = employee.id WHERE salary > 150000
// First do an inner join on employee and department
import {INNER_JOIN} from "../join.js";
import {WHERE} from "../where.js";
import {table} from "../output.js";
import {charity_group, department, employee, employee_charity_group} from "./sampleData.js";

const employeeDept = INNER_JOIN(
  employee,
  department,
  (c) => c["employee.department_id"] === c["department.id"]
);

// then apply the WHERE clause
let result = WHERE(employeeDept, (row) => {
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
//  JOIN employee_charity_group ON employee_charity_group.a = employee.id
//  JOIN charity_group ON charity_group.id = employee_charity_group.b
//  WHERE salary > 150000 AND charity_group.name = 'Cat Lovers';
// First do join via join table as above
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
result = WHERE(join2, (row) => {
  return row['employee.salary'] > 150000 && row['charity_group.name'] === 'Cat Lovers';
});
table(result);

/*
┌─────────────┬───────────────┬─────────────────┬────────────────────────┬─────────────────┬──────────────────────────┬──────────────────────────┬──────────────────┬────────────────────┐
│ employee.id │ employee.name │ employee.salary │ employee.department_id │ employee.status │ employee_charity_group.A │ employee_charity_group.B │ charity_group.id │ charity_group.name │
├─────────────┼───────────────┼─────────────────┼────────────────────────┼─────────────────┼──────────────────────────┼──────────────────────────┼──────────────────┼────────────────────┤
│      2      │     Jane      │     160000      │           2            │     active      │            2             │            1             │        1         │     Cat Lovers     │
│      4      │    Elliot     │     180000      │           1            │     active      │            4             │            1             │        1         │     Cat Lovers     │
└─────────────┴───────────────┴─────────────────┴────────────────────────┴─────────────────┴──────────────────────────┴──────────────────────────┴──────────────────┴────────────────────┘
*/
