// order by name
import {SELECT} from "../select.js";
import {table} from "../output.js";
import {employee} from "./sampleData.js";
import {ORDER_BY} from "../orderBy.js";

let result = SELECT(employee, ['name', 'status']);
result = ORDER_BY(result, (a,b) => {
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
});
table(result);

// order by status
result = SELECT(employee, ['name', 'status']);
result = ORDER_BY(result, (a,b) => {
  if (a.status < b.status) {
    return -1;
  } else {
    return 1;
  }
});
table(result);
