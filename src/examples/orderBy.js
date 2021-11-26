// order by name
import {SELECT} from "../select.js";
import {table} from "../output.js";
import {ORDER_BY} from "../orderBy.js";
import {FROM} from "../from.js";
import {initSQLToy} from "../index.js";
import {setupDatabase} from "./sampleData.js";
import {INSERT_INTO} from "../insertInto.js";
import {DROP_TABLE} from "../dropTable.js";
import {CREATE_TABLE} from "../createTable.js";

initSQLToy();
setupDatabase();
let employee;
let result;

DROP_TABLE('employee');
CREATE_TABLE('employee');
INSERT_INTO('employee',[
  {id:1,name:'Josh',department_id:1,role:'Worker'},
  {id:2,name:'Ruth',department_id:2,role:'Worker'},
  {id:3,name:'Jake',department_id:1,role:'Worker'},
  {id:4,name:'John',department_id:2,role:'Worker'},
  {id:5,name:'Alice',department_id:2,role:'Manager'},
  {id:6,name:'Dan',department_id:1,role:'Manager'},
  {id:7,name:'Janet',department_id:1,role:'Manager'},
]);
employee = FROM('employee');
result = ORDER_BY(employee, (a, b) => a['name'].localeCompare(b['name']));
table(result);
process.exit();

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
