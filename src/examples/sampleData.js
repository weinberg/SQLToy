/******************
 *
 * Sample data
 *
 *****************/

/*
To get this data into another database to test:

CREATE TABLE employee ( id integer PRIMARY KEY, name varchar(40), salary integer, department_id integer, status varchar(40));
CREATE TABLE department (id integer PRIMARY KEY, name varchar(40));
CREATE TABLE charity_group (id integer PRIMARY KEY, name varchar(40));
CREATE TABLE employee_charity_group (a integer references employee (id), b integer references charity_group (id));
INSERT INTO employee VALUES (1,'Josh', 150000, 1, 'inactive'), (2,'Jane', 160000, 2, 'active'), (3,'Ruth', 200000, 1, 'inactive'), (4,'Elliot',180000, 1, 'active'),(5,'Michael',120000, null, 'active'), (6,'Garth',200000, null, 'active');
INSERT INTO department VALUES (1,'Sales'),(2,'Engineering'),(3,'Management'),(4,'Consultants');
INSERT INTO charity_group VALUES (1,'Cat Lovers'),(2,'House Builders'),(3,'Food for the Needy'),(4,'Environmentalists'),(5,'Education for Kids'),(6,'Hippie Music for Peace');
INSERT INTO employee_charity_group VALUES (1,1),(1,4),(2,1),(3,4),(3,5),(4,1),(4,2),(4,3),(4,4);

*/


const employee = {
  name: "employee",
  rows: [
    {id: 1, name: "Josh", salary: 150000, department_id: 1, status: 'inactive',},
    {id: 2, name: "Jane", salary: 160000, department_id: 2, status: 'active',},
    {id: 3, name: "Ruth", salary: 200000, department_id: 1, status: 'inactive',},
    {id: 4, name: "Elliot", salary: 180000, department_id: 1, status: 'active',},
    {id: 5, name: "Michael", salary: 120000, department_id: null, status: 'active',},
    {id: 6, name: "Garth", salary: 200000, department_id: null, status: 'active',},
  ],
};

const department = {
  name: "department",
  rows: [
    {id: 1, name: "Sales"},
    {id: 2, name: "Engineering"},
    {id: 3, name: "Management"},
    {id: 4, name: "Consultants"},
  ],
};

const charity_group = {
  name: "charity_group",
  rows: [
    {id: 1, name: "Cat Lovers"},
    {id: 2, name: "House Builders"},
    {id: 3, name: "Food for the Needy"},
    {id: 4, name: "Environmentalists"},
    {id: 5, name: "Education for Kids"},
    {id: 6, name: "Hippie Music for Peace"},
  ],
}

// join table for many-to-many relation between employee and charity_group
// employees can be in zero or more groups
// groups can have zero or more employees
const employee_charity_group = {
  name: "employee_charity_group",
  rows: [
    {A: 1, B: 1}, // Josh - Cat Lovers
    {A: 1, B: 4}, // Josh - Environmentalists
    {A: 2, B: 1}, // Jane - Cat lovers
    {A: 3, B: 4}, // Ruth - Environmentalists
    {A: 3, B: 5}, // Ruth - Education for kids
    {A: 4, B: 1}, // Elliot - Cat Lovers
    {A: 4, B: 2}, // Elliot - House Builders
    {A: 4, B: 3}, // Elliot - Food for the Needy
    {A: 4, B: 4}, // Elliot - Environmentalists
  ],
}

export { employee, department, charity_group, employee_charity_group };
