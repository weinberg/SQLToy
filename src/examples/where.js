// SELECT * FROM employee JOIN department ON department.id = employee.id WHERE salary > 150000
// First do an inner join on employee and department
import {INNER_JOIN} from "../join.js";
import {WHERE} from "../where.js";
import {csv} from "../output.js";
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
csv(result);

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
csv(result);
