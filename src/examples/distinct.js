import {table} from "../output.js";
import {SELECT} from "../select.js";
import {DISTINCT} from "../distinct.js";
import {initJSDB} from "../index.js";
import {setupDatabase} from "./sampleData.js";
import {FROM} from "../from.js";
import {JOIN} from "../join.js";
import {WHERE} from "../where.js";
import {GROUP_BY} from "../groupBy.js";
import {COUNT} from "../aggregate.js";
import {ORDER_BY} from "../orderBy.js";

// demo distinct

initJSDB();
setupDatabase();
let employee;
let club;
let employee_club;
let result;

// Distinct on status
employee = FROM('employee');
result = SELECT(employee, ['status']);
result = DISTINCT(result, ['status']);
table(result);

// Output:
/*
┌────────────┐
│   status   │
├────────────┤
│ 'inactive' │
│  'active'  │
└────────────┘
*/

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
│ employee.status │  club.name  │ count │
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
