import {SELECT} from "../select.js";
import {table} from "../output.js";
import {initSQLToy} from "../index.js";
import {FROM} from "../from.js";
import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";
import {JOIN} from "../join.js";


initSQLToy();

/*****************************************************/
/*
+-------------+------------+----------+------------------+
| player_id   | type       | result   | length_minutes   |
|-------------+------------+----------+------------------|
| 1           | Chess      | Win      | 23.5             |
| 1           | Chess      | Loss     | 26.5             |
| 2           | Checkers   | Loss     | 6.5              |
| 2           | Dominos    | Loss     | 9.1              |
| 1           | Battleship | Win      | 27.9             |
+-------------+------------+----------+------------------+
 */

/*
CREATE_TABLE('games');
INSERT_INTO('games', [
  {player_id:1,type:'Chess',result:'Win',length_minutes:23.5},
  {player_id:1,type:'Chess',result:'Loss',length_minutes:26.5},
  {player_id:2,type:'Checkers',result:'Loss',length_minutes:6.5},
  {player_id:2,type:'Dominos',result:'Loss',length_minutes:9.1},
  {player_id:1,type:'Battleshipt',result:'Win',length_minutes:27.9},
]);
const games = FROM('games');
const result = SELECT(games, ['type', 'result']);
table(result);
process.exit();
 */

/*****************************************************/

/*
+------+--------+
| id   | name   |
|------+--------|
| 1    | Josh   |
| 2    | Ruth   |
| 3    | Carl   |
+------+--------+
 */
CREATE_TABLE('games');
INSERT_INTO('games', [
  {player_id: 1, type: 'Chess', result: 'Win', length_minutes: 23.5},
  {player_id: 1, type: 'Chess', result: 'Loss', length_minutes: 26.5},
  {player_id: 2, type: 'Checkers', result: 'Loss', length_minutes: 6.5},
  {player_id: 2, type: 'Dominos', result: 'Loss', length_minutes: 9.1},
  {player_id: 1, type: 'Battleshipt', result: 'Win', length_minutes: 27.9},
]);
CREATE_TABLE('player');
INSERT_INTO('player', [
  {id: 1, name: 'Josh'},
  {id: 2, name: 'Ruth'},
  {id: 3, name: 'Carl'},
]);
const games = FROM('games');
const player = FROM('player');
let result = JOIN(games, player, c => c['games.player_id'] === c['player.id']);
result = SELECT(result, ['games.type', 'player.name', 'games.result'], {'games.type': 'Game Type', 'player.name': 'Player Name', 'games.result': 'Win or Loss'});
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
