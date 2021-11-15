// order by name
import {SELECT} from "../select.js";
import {table} from "../output.js";
import {ORDER_BY} from "../orderBy.js";
import {FROM} from "../from.js";
import {initJSDB} from "../index.js";
import {setupDatabase} from "./sampleData.js";

initJSDB();
setupDatabase();
let employee;
let result;

employee = FROM('employee');
result = SELECT(employee, ['name', 'status']);
result = ORDER_BY(result, (a,b) => { if (a.name < b.name) { return -1; } else { return 1; } });
console.log('Order by name:');
table(result);

/*
┌───────────┬────────────┐
│   name    │   status   │
├───────────┼────────────┤
│  Elliot   │   active   │
│   Garth   │   active   │
│   Jane    │   active   │
│   Josh    │  inactive  │
│  Michael  │   active   │
│   Ruth    │  inactive  │
└───────────┴────────────┘
 */

// order by status
employee = FROM('employee');
result = SELECT(employee, ['name', 'status']);
result = ORDER_BY(result, (a,b) => { if (a.status < b.status) { return -1; } else { return 1; } });
console.log('Order by status:');
table(result);

/*
┌───────────┬────────────┐
│   name    │   status   │
├───────────┼────────────┤
│   Jane    │   active   │
│  Elliot   │   active   │
│  Michael  │   active   │
│   Garth   │   active   │
│   Josh    │  inactive  │
│   Ruth    │  inactive  │
└───────────┴────────────┘

 */
