# What is SQLToy?

SQLToy is an in-memory SQL database written in Javascript. It is under 500 lines of code and has zero dependencies. It supports the following SQL operations:

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

SQLToy is for learning SQL. Instead of doing this from the "outside-in" by learning the query language you do it "inside-out" by going through the implementation of the most common SQL operators. Instead of just learning what the operators do, you also learn how they do it which (hopefully!) gives you a much deeper level of understanding.

A detailed [Wiki](https://github.com/weinberg/SQLToy/wiki) walks through the code. Please take a look!

To get the most out of this repository you should have familiarity with Javascript and some ES6 syntax. If you are proficient in another programming language like Python or Java you should still be able to figure things out. This is not a primer on how to write a production grade database. No attempts are made at performance optimization or compatibility with any standard. SQLToy does not support persistence, transactions or even parsing queries. There are many ways you can break it. See below for usage.

## [Read the Wiki](https://github.com/weinberg/SQLToy/wiki)

The heart of this repo is not the code itself but the walkthrough which describes what you need to understand it:

This can be found here: [SQLToy Wiki](https://github.com/weinberg/SQLToy/wiki)

If you are a Javascript programmer I suspect you will find it much simpler than you think. Give it a look!

## OK, I will read the Wiki. But how do I _use_ this database?

There are two concepts you should understand in order to use the database. These are described in detail in the wiki section [Key Concepts](https://github.com/weinberg/SQLToy/wiki/Two-Key-Concepts).

1. SQL order of operations. You must call the operations in the correct order. A "real" database will do this for you. In this database you must call the operations in the correct order yourself.

2. "Tables in, tables out". All operations in this database (and _conceptually_ in a real database) take tables as input and produce tables as output. So you take a table and provide it to an operation, getting a new table back.  To apply multiple operations, supply that new table as an argument to the next operation.

As an example, the following query in both PostgreSQL and SQLToy:

##### PostgreSQL
```SQL
SELECT DISTINCT status, club.name, COUNT(*) AS count FROM employee
  JOIN employee_club 
    ON employee_club.a = employee.id
  JOIN club
    ON club.id = employee_club.b
  WHERE employee.salary > 80000
  GROUP BY status, club.name
  ORDER BY count DESC;

+----------+--------------------+---------+
| status   | name               | count   |
|----------+--------------------+---------|
| active   | Cat Lovers         | 2       |
| active   | Rotary Club        | 1       |
| active   | BBQ Crew           | 1       |
| active   | House Builders     | 1       |
| inactive | Education for Kids | 1       |
| inactive | Environmentalists  | 1       |
+----------+--------------------+---------+
```

##### SQLToy

To make this query in SQLToy we must re-order the operations according to the [SQL Order of Operations](https://github.com/weinberg/SQLToy/wiki/Two-Key-Concepts) and chain them together:

```javascript
let employee = FROM('employee');
let employee_club = FROM('employee_club');
result = JOIN(employee, employee_club, (c) => c["employee_club.A"] === c["employee.id"]);
result = JOIN(result, club, (c) => c["employee_club.B"] === c["club.id"] );
result = WHERE(result, (row) => row['employee.salary'] > 150000);
result = GROUP_BY(result, ['employee.status', 'club.name']);
result = COUNT(result, 'club.name');
result = SELECT(result,['employee.status', 'club.name','COUNT(club.name)'],{'COUNT(club.name)': 'count'})
result = DISTINCT(result, ['employee.status', 'club.name', 'count'])
result = ORDER_BY(result, (a,b) => a.count < b.count ? 1 : -1);
table(result);
```

The resulting table can be viewed with the `table()` helper and looks like this:

```
┌─────────────────┬──────────────────────┬───────┐
│ employee.status │  club.name           │ count │
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

## Contributions

I welcome contributions! The goals of this project are:

- Teach SQL through a simple Javascript SQL database implementation
- Simplicity and readability over features or compatibility with any standard
- As few dependencies as possible

If you have ideas to further these goals you are welcome to submit a pull-request.

## License

The code in SQLToy is licensed under [The MIT License](https://github.com/weinberg/SQLToy/blob/main/LICENSE).

The contents of the Wiki are licensed separately under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](https://github.com/weinberg/SQLToy/wiki/LICENSE).

