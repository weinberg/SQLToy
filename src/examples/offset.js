import {SELECT} from "../select.js";
import {employee} from "./sampleData.js";
import {ORDER_BY} from "../orderBy.js";
import {OFFSET} from "../offset.js";
import {table} from "../output.js";

let result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
result = OFFSET(result, 2);
table(result);

/*
┌──────────┬────────────┬────────┐
│   name   │   status   │ salary │
├──────────┼────────────┼────────┤
│   Jane   │   active   │ 160000 │
│  Elliot  │   active   │ 180000 │
│   Ruth   │  inactive  │ 200000 │
│  Garth   │   active   │ 200000 │
└──────────┴────────────┴────────┘
*/
