import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";
import {table} from "../output.js";
import {FROM} from "../from.js";
import {initSQLToy} from "../index.js";

/******************
 *
 * Sample data
 *
 *****************/

/*
employee
+------+--------+-----------------+
| id   | name   | department_id   |
|------+--------+-----------------|
| 1    | Josh   | 1               |
| 2    | Ruth   | 2               |
| 3    | Greg   | 5               |
+------+--------+-----------------+

department
+------+-------------+
| id   | name        |
|------+-------------|
| 1    | Sales       |
| 2    | Marketing   |
| 3    | Engineering |
+------+-------------+
*/

// simple data
function setupSimpleDatabase() {
  CREATE_TABLE('employee');
  INSERT_INTO('employee', {id: 1, name: "Josh", department_id: 1, salary: 50000});
  INSERT_INTO('employee', {id: 2, name: "Ruth", department_id: 2, salary: 60000});
  INSERT_INTO('employee', {id: 3, name: "Greg", department_id: 5, salary: 70000});
  INSERT_INTO('employee', {id: 4, name: "Pat", department_id: 1, salary: 80000});

  CREATE_TABLE('department');
  INSERT_INTO('department', {id: 1, name: "Sales"});
  INSERT_INTO('department', {id: 2, name: "Marketing"});
  INSERT_INTO('department', {id: 3, name: "Engineering"});
}

// more complex data
function setupDatabase() {
  CREATE_TABLE('employee');
  INSERT_INTO('employee', {id: 1, name: "Josh"});
  INSERT_INTO('employee', {id: 2, name: "Jane"});
  INSERT_INTO('employee', {id: 3, name: "Ruth"});
  INSERT_INTO('employee', {id: 4, name: "Elliot"});
  INSERT_INTO('employee', {id: 5, name: "Michael"});
  INSERT_INTO('employee', {id: 6, name: "Garth"});

  CREATE_TABLE('department');
  INSERT_INTO('department', {id: 1, name: "Sales"});
  INSERT_INTO('department', {id: 2, name: "Engineering"});
  INSERT_INTO('department', {id: 3, name: "Management"});
  INSERT_INTO('department', {id: 4, name: "Consultants"});

  CREATE_TABLE('club');
  INSERT_INTO('club', {id: 1, name: "Cat Lovers"});
  INSERT_INTO('club', {id: 2, name: "House Builders"});
  INSERT_INTO('club', {id: 3, name: "Book Drive"});
  INSERT_INTO('club', {id: 4, name: "Carbon Offset Club"});
  INSERT_INTO('club', {id: 5, name: "Asian Languages"});
  INSERT_INTO('club', {id: 6, name: "Weekly Potluck"});

  // join table for many-to-many relation between employee and club
  // employees can be in zero or more groups
  // groups can have zero or more employees
  CREATE_TABLE('employee_club');
  INSERT_INTO('employee_club', {A: 1, B: 1},);
  INSERT_INTO('employee_club', {A: 1, B: 4},);
  INSERT_INTO('employee_club', {A: 2, B: 1},);
  INSERT_INTO('employee_club', {A: 3, B: 4},);
  INSERT_INTO('employee_club', {A: 3, B: 5},);
  INSERT_INTO('employee_club', {A: 4, B: 1},);
  INSERT_INTO('employee_club', {A: 4, B: 2},);
  INSERT_INTO('employee_club', {A: 4, B: 3},);
  INSERT_INTO('employee_club', {A: 4, B: 4},);

  /*
  const employee = FROM('employee');
  table(employee);
  const club = FROM('club');
  table(club);
  const employee_club = FROM('employee_club');
  table(employee_club);
  */
}

/*
initSQLToy();
setupDatabase();
*/

export {setupSimpleDatabase, setupDatabase}
