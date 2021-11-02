/******************
 *
 * Sample data
 *
 *****************/

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
