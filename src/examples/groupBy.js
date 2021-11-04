import {GROUP_BY} from "../groupBy.js";
import {ARRAY_AGG, AVG, COUNT, MAX, MIN} from "../aggregate.js";
import {table} from "../output.js";
import {employee} from "./sampleData.js";

console.log('SELECT department_id, array_agg(salary) FROM employee GROUP BY department_id');

let group = GROUP_BY(employee, ['department_id']);
const agg = ARRAY_AGG(group, 'salary');
table(agg)

console.log('SELECT department_id, avg(salary) FROM employee GROUP BY department_id');
group = GROUP_BY(employee, ['department_id']);
const avgs = AVG(group, 'salary');
table(avgs)

// Two aggregate columns:
console.log('SELECT department_id, avg(salary), array_agg(salary) FROM employee GROUP BY department_id');
let result = GROUP_BY(employee, ['department_id']);
result = ARRAY_AGG(result, 'salary');
result = AVG(result, 'salary');
result = MAX(result, 'salary');
result = MIN(result, 'salary');
result = COUNT(result, 'salary');
table(result)

/*
SELECT department_id, array_agg(salary) FROM employee GROUP BY department_id
┌───────────────┬────────────────────────────┐
│ department_id │     ARRAY_AGG(salary)      │
├───────────────┼────────────────────────────┤
│       1       │ [ 150000, 200000, 180000 ] │
│       2       │         [ 160000 ]         │
│               │     [ 120000, 200000 ]     │
└───────────────┴────────────────────────────┘


SELECT department_id, avg(salary) FROM employee GROUP BY department_id
┌───────────────┬────────────────────┐
│ department_id │    AVG(salary)     │
├───────────────┼────────────────────┤
│       1       │ 176666.66666666666 │
│       2       │       160000       │
│               │       160000       │
└───────────────┴────────────────────┘


SELECT department_id, avg(salary), array_agg(salary) FROM employee GROUP BY department_id
┌───────────────┬────────────────────────────┬────────────────────┬─────────────┬─────────────┬───────────────┐
│ department_id │     ARRAY_AGG(salary)      │    AVG(salary)     │ MAX(salary) │ MIN(salary) │ COUNT(salary) │
├───────────────┼────────────────────────────┼────────────────────┼─────────────┼─────────────┼───────────────┤
│       1       │ [ 150000, 200000, 180000 ] │ 176666.66666666666 │   200000    │   150000    │       3       │
│       2       │         [ 160000 ]         │       160000       │   160000    │   160000    │       1       │
│               │     [ 120000, 200000 ]     │       160000       │   200000    │   120000    │       2       │
└───────────────┴────────────────────────────┴────────────────────┴─────────────┴─────────────┴───────────────┘
 */