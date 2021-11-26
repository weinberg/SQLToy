import {table} from "../output.js";
import {SELECT} from "../select.js";
import {ORDER_BY} from "../orderBy.js";
import {OFFSET} from "../offset.js";
import {LIMIT} from "../limit.js";
import {setupDatabase} from "./sampleData.js";
import {initSQLToy} from "../index.js";
import {FROM} from "../from.js";

// OFFSET and LIMIT used together paginate data

initSQLToy();
setupDatabase();
let employee;
let result;

// page 1
employee = FROM('employee');
result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
result = OFFSET(result, 0);
result = LIMIT(result, 4);
table(result);

/*
┌───────────┬────────────┬────────┐
│   name    │   status   │ salary │
├───────────┼────────────┼────────┤
│  Michael  │   active   │ 120000 │
│   Josh    │  inactive  │ 150000 │
│   Jane    │   active   │ 160000 │
│  Elliot   │   active   │ 180000 │
└───────────┴────────────┴────────┘
 */


// page 2
employee = FROM('employee');
result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
result = OFFSET(result, 4);
result = LIMIT(result, 4);
table(result);

/*
┌─────────┬────────────┬────────┐
│  name   │   status   │ salary │
├─────────┼────────────┼────────┤
│  Ruth   │  inactive  │ 200000 │
│  Garth  │   active   │ 200000 │
└─────────┴────────────┴────────┘
*/
