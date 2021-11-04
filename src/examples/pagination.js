import {table} from "../output.js";
import {SELECT} from "../select.js";
import {ORDER_BY} from "../orderBy.js";
import {OFFSET} from "../offset.js";
import {LIMIT} from "../limit.js";
import {employee} from "./sampleData.js";

// OFFSET and LIMIT used together paginate data

let result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
// page 1
let off = OFFSET(result, 0);
let page = LIMIT(off, 4);
table(page);
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
off = OFFSET(result, 4);
page = LIMIT(off, 4);
table(page);

/*
┌─────────┬────────────┬────────┐
│  name   │   status   │ salary │
├─────────┼────────────┼────────┤
│  Ruth   │  inactive  │ 200000 │
│  Garth  │   active   │ 200000 │
└─────────┴────────────┴────────┘
*/
