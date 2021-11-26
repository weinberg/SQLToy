import {SELECT} from "../select.js";
import {LIMIT} from "../limit.js";
import {ORDER_BY} from "../orderBy.js";
import {table} from "../output.js";
import {initSQLToy} from "../index.js";
import {setupDatabase} from "./sampleData.js";
import {FROM} from "../from.js";

initSQLToy();
setupDatabase();
let employee;
let result;

employee = FROM('employee');
result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
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
