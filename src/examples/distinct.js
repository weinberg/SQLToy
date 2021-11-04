import {table} from "../output.js";
import {JOIN} from "../join.js";
import {WHERE} from "../where.js";
import {GROUP_BY} from "../groupBy.js";
import {COUNT} from "../aggregate.js";
import {SELECT} from "../select.js";
import {DISTINCT} from "../distinct.js";
import {charity_group, employee, employee_charity_group} from "./sampleData.js";
import {ORDER_BY} from "../orderBy.js";

// demo distinct

// Distinct on status
/*
const sel = SELECT(employee, ['status']);
const d = DISTINCT(sel, ['status']);
table(d);
process.exit();

// Output:
┌────────────┐
│   status   │
├────────────┤
│ 'inactive' │
│  'active'  │
└────────────┘
*/

// This query joins on charity_group and then does distinct on status and charity_group.name
// which leads to (active, Cat Lovers) and (inactive, Environmentalists) being condensed to a single row
//
// SELECT distinct status, charity_group.name, COUNT(*) AS count FROM employee
// JOIN employee_charity_group ON employee_charity_group.a = employee.id
// JOIN charity_group ON charity_group.id = employee_charity_group.b
// WHERE employee.salary > 150000
// GROUP BY status, charity_group.name

/*
Result:
┌─────────────────┬──────────────────────┬───────┐
│ employee.status │  charity_group.name  │ count │
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

let result = JOIN(
  employee,
  employee_charity_group,
  (c) => c["employee_charity_group.A"] === c["employee.id"]
);
result = JOIN(
  result,
  charity_group,
  (c) => c["employee_charity_group.B"] === c["charity_group.id"]
);

// then WHERE
result = WHERE(result, (row) => row['employee.salary'] > 150000);

// then Group By and aggregates

result = GROUP_BY(result, ['employee.status', 'charity_group.name']);
result = COUNT(result, 'charity_group.name');

// then apply SELECT
result = SELECT(result, ['employee.status', 'charity_group.name', 'COUNT(charity_group.name)'], {'COUNT(charity_group.name)': 'count'});
result = DISTINCT(result, ['employee.status', 'charity_group.name', 'count']);
result = ORDER_BY(result, (a, b) => a.count < b.count ? 1 : -1);

table(result);

