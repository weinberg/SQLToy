import {GROUP_BY} from "../groupBy.js";
import {ARRAY_AGG, AVG, COUNT, MAX, MIN} from "../aggregate.js";
import {table} from "../output.js";
import {setupDatabase, setupSimpleDatabase} from "./sampleData.js";
import {initSQLToy} from "../index.js";
import {FROM} from "../from.js";
import {DROP_TABLE} from "../dropTable.js";
import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";
import {SELECT} from "../select.js";

initSQLToy();
setupSimpleDatabase();
let employee;
let result;

/**********************************************/

/*
console.log('SELECT department_id, ARRAY_AGG(role) FROM employee GROUP BY department_id');

DROP_TABLE('employee');
CREATE_TABLE('employee');
INSERT_INTO('employee',[
  {id:1,name:'Josh',department_id:1,role:'Manager'},
  {id:2,name:'Ruth',department_id:2,role:'Worker'},
  {id:3,name:'Jake',department_id:1,role:'Worker'},
  {id:4,name:'John',department_id:2,role:'Worker'},
  {id:5,name:'Alice',department_id:2,role:'Manager'},
  {id:6,name:'Dan',department_id:1,role:'Manager'},
  {id:7,name:'Janet',department_id:1,role:'Manager'},
]);
employee = FROM('employee');
result = GROUP_BY(employee, ['department_id']);
console.log(JSON.stringify(result,null,2));
result = ARRAY_AGG(result, 'name');
result = SELECT(result, ['department_id','ARRAY_AGG(name)']);
table(result)

process.exit();
*/

/**********************************************

console.log('SELECT department_id, role, COUNT(*), ARRAY_AGG(name) FROM employee GROUP BY department_id, role;');

DROP_TABLE('employee');
CREATE_TABLE('employee');
INSERT_INTO('employee',[
  {id:1,name:'Josh',department_id:1,role:'Manager'},
  {id:2,name:'Ruth',department_id:2,role:'Worker'},
  {id:3,name:'Jake',department_id:1,role:'Worker'},
  {id:4,name:'John',department_id:2,role:'Worker'},
  {id:5,name:'Alice',department_id:2,role:'Manager'},
  {id:6,name:'Dan',department_id:1,role:'Manager'},
  {id:7,name:'Janet',department_id:1,role:'Manager'},
]);
employee = FROM('employee');
result = GROUP_BY(employee, ['department_id','role']);
console.log(JSON.stringify(result,null,2));
result = COUNT(result, '*');
result = ARRAY_AGG(result, 'name');
result = SELECT(result, ['department_id','role','COUNT(*)','ARRAY_AGG(name)']);
table(result)

process.exit();
*/

/**********************************************

/*
console.log('SELECT department_id, COUNT(*) FROM employee GROUP BY department_id');

DROP_TABLE('employee');
CREATE_TABLE('employee');
INSERT_INTO('employee',[
  {id:1,name:'Josh',department_id:1,role:'Manager'},
  {id:2,name:'Ruth',department_id:2,role:'Worker'},
  {id:3,name:'Jake',department_id:1,role:'Worker'},
  {id:4,name:'John',department_id:2,role:'Worker'},
  {id:5,name:'Alice',department_id:2,role:'Manager'},
  {id:6,name:'Dan',department_id:1,role:'Manager'},
  {id:7,name:'Janet',department_id:1,role:'Manager'},
]);
employee = FROM('employee');
result = GROUP_BY(employee, ['department_id']);
result = COUNT(result, '*');
result = SELECT(result, ['department_id','COUNT(*)'], {'COUNT(*)': 'count'});
table(result)

process.exit();
*/

/**********************************************/

CREATE_TABLE('test_scores');
INSERT_INTO('test_scores',[
  {student_id:1,test_id:1,score:100},
  {student_id:1,test_id:2,score:90},
  {student_id:2,test_id:1,score:85},
  {student_id:2,test_id:2,score:80},
  {student_id:3,test_id:1,score:75},
  {student_id:3,test_id:2,score:99},
]);
const testScores = FROM('test_scores');
result = GROUP_BY(testScores, ['student_id']);
result = ARRAY_AGG(result, 'score');
console.log(JSON.stringify(result,null,2));
result = SELECT(result, ['student_id','ARRAY_AGG(score)']);
table(result)

process.exit();

/**********************************************/

console.log('SELECT department_id, array_agg(salary) FROM employee GROUP BY department_id');

employee = FROM('employee');
result = GROUP_BY(employee, ['department_id']);
result = ARRAY_AGG(result, 'salary');
table(result)

/**********************************************/

console.log('SELECT department_id, avg(salary) FROM employee GROUP BY department_id');

employee = FROM('employee');
result = GROUP_BY(employee, ['department_id']);
result = AVG(result, 'salary');
table(result)

/**********************************************/

console.log('SELECT department_id, avg(salary), array_agg(salary) FROM employee GROUP BY department_id');

employee = FROM('employee');
result = GROUP_BY(employee, ['department_id']);
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
