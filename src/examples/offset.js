import {SELECT} from "../select.js";
import {ORDER_BY} from "../orderBy.js";
import {OFFSET} from "../offset.js";
import {table} from "../output.js";
import {initSQLToy} from "../index.js";
import {setupDatabase} from "./sampleData.js";
import {FROM} from "../from.js";
import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";
import {LIMIT} from "../limit.js";

initSQLToy();
setupDatabase();
let employee;

CREATE_TABLE('filenames');
INSERT_INTO('filenames', [
  {filename:'00-INDEX'},
  {filename:'07'},
  {filename:'1040.bin.ihex'},
  {filename:'11d.c'},
  {filename:'11d.h'},
  {filename:'1200.bin.ihex'},
  {filename:'12160.bin.ihex'},
  {filename:'1232ea962bbaf0e909365f4964f6cceb2ba8ce'},
  {filename:'1280.bin.ihex'},
  {filename:'15562512ca6cf14c1b8f08e09d5907118deaf0'},
  {filename:'17'},
  {filename:'1d'},
  {filename:'1.Intro'},
  {filename:'21142.c'},
  {filename:'21285.c'},
  {filename:'2860_main_dev.c'},
  {filename:'2860_rtmp_init.c'},
  {filename:'2870_main_dev.c'},
  {filename:'2870_rtmp_init.c'},
  {filename:'2.Process'},
  {filename:''},
]);
const filenames = FROM('filenames');
let result = OFFSET(filenames, 10); // 0 offset is just for example
result = LIMIT(result, 10);
table(result);
process.exit();

/*
employee = FROM('employee');
result = SELECT(employee, ['name', 'status', 'salary']);
result = ORDER_BY(result, (a,b) => a.salary - b.salary);
result = OFFSET(result, 2);
table(result);

/*
┌──────────┬────────────┬────────┐
│   name   │   status   │ salary │
├──────────┼────────────┼────────┤
│   Jane   │   active   │ 160000 │
│  Elliot  │   active   │ 180000 │
│   Ruth   │  inactive  │ 200000 │
│  Garth   │   active   │ 200000 │
└──────────┴────────────┴────────┘
*/
