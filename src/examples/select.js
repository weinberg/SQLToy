import {GROUP_BY} from "../groupBy.js";
import {ARRAY_AGG, COUNT, MAX} from "../aggregate.js";
import {SELECT} from "../select.js";
import {table} from "../output.js";
import {employee} from "./sampleData.js";

debugger;
let result = GROUP_BY(employee, ['department_id', 'status']);
result = ARRAY_AGG(result, 'name');
result = MAX(result, 'salary');
result = COUNT(result, 'status');
const sel = SELECT(result, ['department_id','status','ARRAY_AGG(name)','MAX(salary)','COUNT(status)']);
table(sel);

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
