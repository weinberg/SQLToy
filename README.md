# jsdb
A very simple in-memory relational database to demonstrate how JOINs work in SQL.


# JOIN

A join operation in a relational database is a cross-join of the joined tables with a filtering predicate applied to the result.

# OUTPUT

```
-- Inner join employee, department on department id
-- Equivalent SQL: SELECT * FROM employee JOIN department ON employee.department_id = department.id;
employee.id,employee.name,employee.department_id,department.id,department.name
1,Josh,1,1,Sales
2,Jane,2,2,Engineering
3,Ruth,3,3,Management
4,Elliot,1,1,Sales

-- Left join employee, department on department id --
-- Equivalent SQL: SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;
employee.id,employee.name,employee.department_id,department.id,department.name
1,Josh,1,1,Sales
2,Jane,2,2,Engineering
3,Ruth,3,3,Management
4,Elliot,1,1,Sales
5,Michael,,,
6,Garth,,,

-- Right outer join on department id --
-- Equivalent SQL: SELECT * FROM employee RIGHT JOIN department ON employee.department_id = department.id;
department.id,department.name,employee.id,employee.name,employee.department_id
1,Sales,1,Josh,1
1,Sales,4,Elliot,1
2,Engineering,2,Jane,2
3,Management,3,Ruth,3
4,Consultants,,,
```
