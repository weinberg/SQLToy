import {table} from "../output.js";
import {INNER_JOIN, LEFT_JOIN, RIGHT_JOIN} from "../join.js";
import {charity_group, department, employee, employee_charity_group} from "./sampleData.js";

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
