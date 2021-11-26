import {CREATE_TABLE} from "../createTable.js";
import {INSERT_INTO} from "../insertInto.js";
import {FROM} from "../from.js";
import {table} from "../output.js";
import {initSQLToy} from "../index.js";

initSQLToy();
CREATE_TABLE('stories');
INSERT_INTO('stories', [
  { id: 1, name: 'The Elliptical Machine that ate Manhattan', author_id: 1 },
  { id: 2, name: 'Queen of the Bats', author_id: 2 },
  { id: 3, name: 'ChocoMan', author_id: 3 },
]);
INSERT_INTO('stories', { id: 4, name: 'Something', author_id: 5});
const stories = FROM('stories');
table(stories);
console.log(JSON.stringify(stories,null,2));
