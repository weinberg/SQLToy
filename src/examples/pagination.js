// OFFSET and LIMIT used together paginate data

import {table} from "../output.js";

let result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
// page 1
let off = OFFSET(result, 0);
let page = LIMIT(off, 4);
table(page);
// page 2
off = OFFSET(result, 4);
page = LIMIT(off, 4);
table(page);
