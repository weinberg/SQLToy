import {table} from "../output.js";
import {SELECT} from "../select.js";
import {DISTINCT} from "../distinct.js";
import {initSQLToy} from "../index.js";
import {FROM} from "../from.js";
import {JOIN} from "../join.js";
import {WHERE} from "../where.js";
import {GROUP_BY} from "../groupBy.js";
import {COUNT} from "../aggregate.js";
import {ORDER_BY} from "../orderBy.js";
import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";

// demo distinct

initSQLToy();
/*
+------+------------------+----------+
| id   | city             | state    |
|------+------------------+----------|
| 1    | Denver           | Colorado |
| 2    | Colorado Springs | Colorado |
| 3    | South Park       | Colorado |
| 4    | Corpus Christi   | Texas    |
| 5    | Houston          | Texas    |
| 6    | Denver           | Colorado |
| 7    | Corpus Christi   | Texas    |
+------+------------------+----------+
 */

CREATE_TABLE('friends');
INSERT_INTO('friends',[
  {id:1,city:'Denver',state:'Colorado'},
  {id:2,city:'Colorado Springs',state:'Colorado'},
  {id:3,city:'South Park',state:'Colorado'},
  {id:4,city:'Corpus Christi',state:'Texas'},
  {id:5,city:'Houston',state:'Texas'},
  {id:6,city:'Denver',state:'Colorado'},
  {id:7,city:'Corpus Christi',state:'Texas'},
]);

const friends = FROM('friends');
const result = DISTINCT(friends, ['city', 'state']);
table(result);
process.exit();

/*
CREATE_TABLE('book');
INSERT_INTO('book', [
  { id: 1, name: 'The C Programming Language', status: 'Checked Out' },
  { id: 2, name: 'SQL Fundamentals', status: 'Checked Out' },
  { id: 3, name: 'The Magic Garden Explained', status: 'Checked Out' },
  { id: 4, name: 'The Art of Computer Programming', status: 'Available' },
  { id: 5, name: 'Design Patterns', status: 'Available' },
  { id: 6, name: 'Compilers, ', status: 'Missing' },
]);

// Distinct on status
const book = FROM('book');
let result = SELECT(book, ['status']);
result = DISTINCT(result, ['status']);
table(result);

 */

// Output:
/*
┌───────────────┐
│    status     │
├───────────────┤
│  Checked Out  │
│   Available   │
│    Missing    │
└───────────────┘
*/

// Distinct can work on multiple columns

// This query joins on club and then does distinct on status and club.name
// which leads to (active, Cat Lovers) and (inactive, Environmentalists) being condensed to a single row
//
// SELECT distinct status, club.name, COUNT(*) AS count FROM employee
// JOIN employee_club ON employee_club.a = employee.id
// JOIN club ON club.id = employee_club.b
// WHERE employee.salary > 150000
// GROUP BY status, club.name

/*
Result:
┌─────────────────┬──────────────────────┬───────┐
│ employee.status │  club.name           │ count │
├─────────────────┼──────────────────────┼───────┤
│     active      │      Cat Lovers      │   2   │
│    inactive     │  Environmentalists   │   1   │
│    inactive     │  Education for Kids  │   1   │
│     active      │    House Builders    │   1   │
│     active      │  Food for the Needy  │   1   │
│     active      │  Environmentalists   │   1   │
└─────────────────┴──────────────────────┴───────┘
 */

// First do join via join table

employee = FROM('employee');
club = FROM('club');
employee_club = FROM('employee_club');
result = JOIN(employee, employee_club, (c) => c["employee_club.A"] === c["employee.id"]);
result = JOIN(result, club, (c) => c["employee_club.B"] === c["club.id"]);
result = WHERE(result, (row) => row['employee.salary'] > 150000);
result = GROUP_BY(result, ['employee.status', 'club.name']);
result = COUNT(result, 'club.name');
result = SELECT(result, ['employee.status', 'club.name', 'COUNT(club.name)'], {'COUNT(club.name)': 'count'});
result = DISTINCT(result, ['employee.status', 'club.name', 'count']);
result = ORDER_BY(result, (a, b) => a.count < b.count ? 1 : -1);

table(result);
