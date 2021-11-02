import {GROUP_BY} from "../groupBy.js";
import {ARRAY_AGG, COUNT, MAX} from "../aggregate.js";
import {SELECT} from "../select.js";
import {table} from "../output.js";
import {employee} from "./sampleData.js";

let result = GROUP_BY(employee, ['department_id', 'status']);
result = ARRAY_AGG(result, 'name');
result = MAX(result, 'salary');
result = COUNT(result);
const sel = SELECT(result, ['department_id','status','ARRAY_AGG(name)','MAX(salary)','COUNT()']);
table(sel);

