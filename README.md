# What is SQLToy?

An in-memory SQL database written in Javascript for the purpose of explaining the relational model and SQL order of operations.

SQLToy is under 500 lines of code and has zero dependencies. It supports the following operations:

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

SQLToy does not support persistence, transactions or even parsing queries. You must call the query operations in code in the proper order. See below.

## A new database! I shall deploy it to production!

This is an excellent idea, especially if you like downtime! No, just use SQLToy to learn about SQL.

## Read the Wiki

The core of this repo is not really the code but the walkthrough which describes what you need to understand it.

That is found here: [SQLToy Wiki](https://github.com/weinberg/SQLToy/wiki).

If you are a Javascript programmer I suspect you will find that it is much simpler than you think. Give it a look!

## But how do I _use_ it?

There are two key concepts you should understand in order to use the database. These are described in detail in the wiki section [Key Concepts](https://github.com/weinberg/SQLToy/wiki/Two-Key-Concepts).

First: The SQL order of operations. You must call the operations in the correct order. A "real" database will do this for you. In this database you must call the operations in the correct order yourself. 

Next: "Tables in, tables out". All operations in this database (and _conceptually_ in a real database) take tables as input and produce tables as output. So you take a table and provide it to an operation, getting a new table back in return.  To apply multiple operations, supply that new table as an argument to the next operation.

As an example, the following SQL query:

##### SQL
```SQL
SELECT DISTINCT status, charity_group.name, COUNT(*) AS count FROM employee
  JOIN employee_charity_group 
    ON employee_charity_group.a = employee.id
  JOIN charity_group
    ON charity_group.id = employee_charity_group.b
  WHERE employee.salary > 150000
  GROUP BY status, charity_group.name
  ORDER BY count DESC;

+----------+--------------------+---------+
| status   | name               | count   |
|----------+--------------------+---------|
| active   | Cat Lovers         | 2       |
| active   | Environmentalists  | 1       |
| active   | Food for the Needy | 1       |
| active   | House Builders     | 1       |
| inactive | Education for Kids | 1       |
| inactive | Environmentalists  | 1       |
+----------+--------------------+---------+
```

##### SQLToy
```javascript
let result;
result = JOIN(employee, employee_charity_group, (c) => c["employee_charity_group.A"] === c["employee.id"]);
result = JOIN(result, charity_group, (c) => c["employee_charity_group.B"] === c["charity_group.id"] );
result = WHERE(result, (row) => row['employee.salary'] > 150000);
result = GROUP_BY(result, ['employee.status', 'charity_group.name']);
result = COUNT(result, 'charity_group.name');
result = SELECT(result,['employee.status', 'charity_group.name','COUNT(charity_group.name)'],{'COUNT(charity_group.name)': 'count'})
result = DISTINCT(result, ['employee.status', 'charity_group.name', 'count'])
result = ORDER_BY(result, (a,b) => a.count < b.count ? 1 : -1);
table(result);
```

The resulting table can be viewed with the `table()` helper and looks like this:

```
┌─────────────────┬──────────────────────┬───────┐
│ employee.status │  charity_group.name  │ count │
├─────────────────┼──────────────────────┼───────┤
│     active      │      Cat Lovers      │   2   │
│     active      │  Environmentalists   │   1   │
│     active      │  Food for the Needy  │   1   │
│     active      │    House Builders    │   1   │
│    inactive     │  Education for Kids  │   1   │
│    inactive     │  Environmentalists   │   1   │
└─────────────────┴──────────────────────┴───────┘
```

## References

A good primer on SQL operation execution order:

https://blog.jooq.org/a-beginners-guide-to-the-true-order-of-sql-operations/

For a good discussion of set theory as it applies to the relational model:

https://medium.com/basecs/set-theory-the-method-to-database-madness-5ec4b4f05d79 .

