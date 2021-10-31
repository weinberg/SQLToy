# jsdb

SQL operations written in Javascript for educational purposes.

### Cool a new database! Is this a great database to use in production?

Hell no. Don't use this for anything except learning about how SQL processes a query.

### What operations are supported?

Basic implementations of the following:

- FROM
- CROSS JOIN
- INNER JOIN
- LEFT JOIN
- RIGHT JOIN
- WHERE
- GROUP BY
- Aggregate functions: ARRAY_AGG, MAX, MIN, COUNT
- SELECT
- DISTINCT
- ORDER BY
- OFFSET
- LIMIT

### What is a Join?

A join operation in a relational database is a cross-join of the joined tables with a filtering predicate applied to the
result.

For a good discussion of this see https://medium.com/basecs/set-theory-the-method-to-database-madness-5ec4b4f05d79 .

# Usage

Operations supported:

## Cross Join

`cross(a,b)`: cross takes two tables and returns a table which includes a cross join of all rows

## Inner Join

`innerJoin(a,b)`: innerJoin takes two tables and a predicate. Result will be a table which includes the cross join of
all rows which satisfy the predicate and have no null elements.

## Left Join

`leftJoin(a,b)`: leftJoin takes two tables and a predicate. Result will be a table which includes the cross join of all
rows which satisfy the predicate and which has no nulls in table a.

## Right Join

`rightJoin(a,b)`: rightJoin takes two tables and a predicate. Result will be a table which includes the cross join of
all rows which satisfy the predicate and which has no nulls in table b.

# Sample output

For the following input:

```javascript
const employee = {
  name: "employee",
  rows: [
    {id: 1, name: "Josh", department_id: 1},
    {id: 2, name: "Jane", department_id: 2},
    {id: 3, name: "Ruth", department_id: 3},
    {id: 4, name: "Elliot", department_id: 1},
    {id: 5, name: "Michael", department_id: null},
    {id: 6, name: "Garth", department_id: null},
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
```

### innerJoin

Equivalent SQL: `SELECT * FROM employee JOIN department ON employee.department_id = department.id;`

##### Code:

```javascript
INNER_JOIN(employee, department,
  (c) => c["employee.department_id"] === c["department.id"]
);
```

##### Result:

```text
-- Inner join employee, department on department id
-- Equivalent SQL: SELECT * FROM employee JOIN department ON employee.department_id = department.id;
employee.id,employee.name,employee.department_id,department.id,department.name
1,Josh,1,1,Sales
2,Jane,2,2,Engineering
3,Ruth,3,3,Management
4,Elliot,1,1,Sales
```

### leftJoin

Equivalent SQL: `SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;`

##### Code:

```javascript
LEFT_JOIN(employee, department,
  (c) => c["employee.department_id"] === c["department.id"]
);
```

##### Result:

```text
-- Left join employee, department on department id --
-- Equivalent SQL: SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;
employee.id,employee.name,employee.department_id,department.id,department.name
1,Josh,1,1,Sales
2,Jane,2,2,Engineering
3,Ruth,3,3,Management
4,Elliot,1,1,Sales
5,Michael,,,
6,Garth,,,
```

### rightJoin

Equivalent SQL: `SELECT * FROM employee RIGHT JOIN department ON employee.department_id = department.id;`

##### Code:

```javascript
RIGHT_JOIN(employee, department,
  (c) => c["employee.department_id"] === c["department.id"]
);
```

##### Result:

```text
-- Right outer join on department id --
-- Equivalent SQL: SELECT * FROM employee RIGHT JOIN department ON employee.department_id = department.id;
department.id,department.name,employee.id,employee.name,employee.department_id
1,Sales,1,Josh,1
1,Sales,4,Elliot,1
2,Engineering,2,Jane,2
3,Management,3,Ruth,3
4,Consultants,,,
```
