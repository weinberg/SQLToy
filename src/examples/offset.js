import {SELECT} from "../select.js";
import {employee} from "./sampleData.js";

let result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
result = OFFSET(result, 2);
table(result);
