import {SELECT} from "../select.js";
import {employee} from "./sampleData.js";
import {LIMIT} from "../limit.js";
import {ORDER_BY} from "../orderBy.js";
import {table} from "../output.js";

let result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
result = LIMIT(result, 4);
table(result);

