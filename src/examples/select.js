import {GROUP_BY} from "../groupBy.js";
import {ARRAY_AGG, COUNT, MAX} from "../aggregate.js";
import {SELECT} from "../select.js";
import {table} from "../output.js";
import {setupSampleDatabase} from "./sampleData.js";
import {initJSDB} from "../index.js";
import {FROM} from "../from.js";


initJSDB();
setupSampleDatabase();
let employee;
let result;

employee = FROM('employee');
result = GROUP_BY(employee, ['department_id', 'status']);
result = ARRAY_AGG(result, 'name');
result = MAX(result, 'salary');
result = COUNT(result, 'status');
result = SELECT(result, ['department_id','status','ARRAY_AGG(name)','MAX(salary)','COUNT(status)']);
table(result);

/*
┌───────────────┬────────────┬────────────────────────┬─────────────┬───────────────┐
│ department_id │   status   │    ARRAY_AGG(name)     │ MAX(salary) │ COUNT(status) │
├───────────────┼────────────┼────────────────────────┼─────────────┼───────────────┤
│       1       │  inactive  │   [  Josh ,  Ruth  ]   │   200000    │       2       │
│       2       │   active   │       [  Jane  ]       │   160000    │       1       │
│       1       │   active   │      [  Elliot  ]      │   180000    │       1       │
│               │   active   │ [  Michael ,  Garth  ] │   200000    │       2       │
└───────────────┴────────────┴────────────────────────┴─────────────┴───────────────┘

*/
