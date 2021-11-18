# SQLToy

An in-memory SQL database written in Javascript for the purpose of explaining the relational model and SQL order of operations.

### Cool a new database! I will deploy this to production!

An excellent idea! Especially if you like downtime!

Don't use this for anything except learning about SQL.

### What operations are supported?

Currently:

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
- CREATE TABLE
- INSERT INTO
- UPDATE

### How do I use this database?

The best introduction to this code is via the wiki. If you are a Javascript programmer I suspect you will find that it is much simpler than you think. Give it a look!

### But how do I _use_ it?

All operations in this database (and _conceptually_ in a real database also) take tables as input and produce tables as output.
So you take a table and provide it to an operation, getting a new table back in return.  To apply multiple operations, supply that new table to the next operation.

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

# References

A good primer on SQL operation execution order:

https://blog.jooq.org/a-beginners-guide-to-the-true-order-of-sql-operations/
