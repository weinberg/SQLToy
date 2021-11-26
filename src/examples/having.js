import {GROUP_BY} from "../groupBy.js";
import {COUNT} from "../aggregate.js";
import {table} from "../output.js";
import {HAVING} from "../having.js";
import {initSQLToy} from "../index.js";
import {setupDatabase} from "./sampleData.js";
import {FROM} from "../from.js";

initSQLToy();
setupDatabase();
let employee;
let result;

employee = FROM('employee');
result = GROUP_BY(employee, ['department_id']);
result = COUNT(result, 'department_id');
result = HAVING(result, (row) => row['COUNT(department_id)'] > 2);
table(result);

/*
┌───────────────┬──────────────────────┐
│ department_id │ COUNT(department_id) │
├───────────────┼──────────────────────┤
│       1       │          3           │
└───────────────┴──────────────────────┘
 */
