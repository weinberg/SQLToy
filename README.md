# jsdb

SQL operations written in Javascript for educational purposes.

### Cool a new database! Is this a great database to use in production?

Hell no. Don't use this for anything except learning about how SQL processes a query.

### What operations are supported?

Basic implementations of the following:

- SELECT
- FROM
- CROSS JOIN
- INNER JOIN
- LEFT JOIN
- RIGHT JOIN
- WHERE
- GROUP BY
- Aggregate functions: ARRAY_AGG, MAX, MIN, COUNT
- DISTINCT
- ORDER BY
- OFFSET
- LIMIT

### How do I use this database?

The purpose of this database is education so the best way to "use" it is to go through the code and understand how the various operations are implemented. 

If you are a Javascript programmer I suspect you will find that it is much simpler than you think. Give it a look!

### OK, smart-alec, but how do I _use_ it?

The thing to understand is that all operations in this database (and _conceptually_ in a real database also) take tables as input and produce tables as output.
So you take a table and provide it to an operation, getting a modified table back in return.
To apply multiple operations, supply that modified database to the next operation.

For example, the query:

```SQL
SELECT DISTINCT status, charity_group.name, COUNT(*) AS count FROM employee
    JOIN employee_charity_group ON employee_charity_group.a = employee.id
    JOIN charity_group ON charity_group.id = employee_charity_group.b
    WHERE employee.salary > 150000
    GROUP BY status, charity_group.name
```

Is done like this:

```javascript
// First joins
let result = INNER_JOIN( employee, employee_charity_group,
  (c) => c["employee_charity_group.A"] === c["employee.id"]
);
result = INNER_JOIN( result, charity_group,
  (c) => c["employee_charity_group.B"] === c["charity_group.id"]
);

// then WHERE
result = WHERE(result, (row) => row['employee.salary'] > 150000);

// then Group By and aggregate
result = GROUP_BY(result, ['employee.status', 'charity_group.name']);
result = COUNT(result, 'charity_group.name');

// then SELECT
result = SELECT(result, ['employee.status', 'charity_group.name','COUNT(charity_group.name)'],{'COUNT(charity_group.name)': 'count'})
result = DISTINCT(result, ['employee.status', 'charity_group.name', 'count'])
table(result);
```

You will notice that in the SQL the `SELECT` and `DISTINCT` come before the `JOIN` and `GROUP BY` but in our code they come after.
This is because the SQL engine is rearranging the query and executing it in the following order:

```
 1 FROM, including JOINs
 2 WHERE
 3 GROUP BY, including aggregate functions
 4 HAVING
 5 WINDOW functions
 6 SELECT
 7 DISTINCT
 8 UNION
 9 ORDER BY
10 LIMIT and OFFSET
```

We don't have a parser or a planner so you have to provide the correct order ourselves.

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
