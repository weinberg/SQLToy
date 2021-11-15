import {table} from "../output.js";
import {setupDatabase} from "./sampleData.js";
import {initJSDB} from "../index.js";
import {FROM} from "../from.js";
import {UPDATE} from "../update.js";


initJSDB();
setupDatabase();
let employee;
let result;

employee = FROM('employee');
table(employee);

result = UPDATE(employee, {name: 'JOSH'}, (row) => row.name === 'Josh');

table(result);
