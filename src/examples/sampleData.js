import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";

/******************
 *
 * Sample data
 *
 *****************/

function setupSampleDatabase() {
  CREATE_TABLE('employee');
  INSERT_INTO('employee', {id: 1, name: "Josh", salary: 150000, department_id: 1, status: 'inactive'});
  INSERT_INTO('employee', {id: 2, name: "Jane", salary: 160000, department_id: 2, status: 'active',},);
  INSERT_INTO('employee', {id: 3, name: "Ruth", salary: 200000, department_id: 1, status: 'inactive',},);
  INSERT_INTO('employee', {id: 4, name: "Elliot", salary: 180000, department_id: 1, status: 'active',},);
  INSERT_INTO('employee', {id: 5, name: "Michael", salary: 120000, department_id: null, status: 'active',},);
  INSERT_INTO('employee', {id: 6, name: "Garth", salary: 200000, department_id: null, status: 'active',},);

  CREATE_TABLE('department');
  INSERT_INTO('department', {id: 1, name: "Sales"});
  INSERT_INTO('department', {id: 2, name: "Engineering"});
  INSERT_INTO('department', {id: 3, name: "Management"});
  INSERT_INTO('department', {id: 4, name: "Consultants"});

  CREATE_TABLE('charity_group');
  INSERT_INTO('charity_group', {id: 1, name: "Cat Lovers"});
  INSERT_INTO('charity_group', {id: 2, name: "House Builders"});
  INSERT_INTO('charity_group', {id: 3, name: "Food for the Needy"});
  INSERT_INTO('charity_group', {id: 4, name: "Environmentalists"});
  INSERT_INTO('charity_group', {id: 5, name: "Education for Kids"});
  INSERT_INTO('charity_group', {id: 6, name: "Hippie Music for Peace"});

  // join table for many-to-many relation between employee and charity_group
  // employees can be in zero or more groups
  // groups can have zero or more employees
  CREATE_TABLE('employee_charity_group');
  INSERT_INTO('employee_charity_group', {A: 1, B: 1},); // Josh - Cat Lovers
  INSERT_INTO('employee_charity_group', {A: 1, B: 4},); // Josh - Environmentalists
  INSERT_INTO('employee_charity_group', {A: 2, B: 1},); // Jane - Cat lovers
  INSERT_INTO('employee_charity_group', {A: 3, B: 4},); // Ruth - Environmentalists
  INSERT_INTO('employee_charity_group', {A: 3, B: 5},); // Ruth - Education for kids
  INSERT_INTO('employee_charity_group', {A: 4, B: 1},); // Elliot - Cat Lovers
  INSERT_INTO('employee_charity_group', {A: 4, B: 2},); // Elliot - House Builders
  INSERT_INTO('employee_charity_group', {A: 4, B: 3},); // Elliot - Food for the Needy
  INSERT_INTO('employee_charity_group', {A: 4, B: 4},); // Elliot - Environmentalists
}

export {setupSampleDatabase}
