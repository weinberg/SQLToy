import {GROUP_BY} from "../groupBy.js";
import {ARRAY_AGG, COUNT, MAX} from "../aggregate.js";
import {SELECT} from "../select.js";
import {table} from "../output.js";
import {setupDatabase} from "./sampleData.js";
import {initJSDB} from "../index.js";
import {FROM} from "../from.js";
import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";


initJSDB();

/*****************************************************/

CREATE_TABLE('games');
INSERT_INTO('games', [
  {player1_id:1,player2_id:2,type:'Chess',winner_id:1,length_minutes:35},
  {player1_id:1,player2_id:2,type:'Checkers',winner_id:2,length_minutes:10},
  {player1_id:2,player2_id:3,type:'Battleship',winner_id:2,length_minutes:30},
]);
const games = FROM('games');
const result = SELECT(games, ['type', 'winner_id']);
table(result);
process.exit();

/*****************************************************

setupDatabase();
let employee;
let result;

employee = FROM('employee');
result = GROUP_BY(employee, ['department_id', 'status']);
result = ARRAY_AGG(result, 'name');
result = MAX(result, 'salary');
result = COUNT(result, 'status');
result = SELECT(result, ['department_id','status','ARRAY_AGG(name)','MAX(salary)','COUNT(status)']);
table(result);
*/

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
