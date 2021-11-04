import { Console } from 'console'
import { Transform } from 'stream'

// CSV output
const csv = (a) => {
  a.rows.forEach((i) => delete i["_tableRows"]);
  a.rows.forEach((i) => delete i["_groupedValues"]);
  console.log(Object.keys(a.rows[0]).join(','));
  for (let i of a.rows) {
    const outputValues = [];
    for (let value of Object.values(i)) {
      if (value === '') {
        outputValues.push('<null>');
      } else if (Array.isArray(value)) {
        outputValues.push(`"[${value.join(',')}]"`)
      } else {
        outputValues.push(value);
      }
    }
    console.log(outputValues.join(','));
  }
};

// Table output
// The console.table table has an extra "(index)" column which is very confusing in this context
// so we remove it.

const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
const logger = new Console({ stdout: ts })

// @see https://stackoverflow.com/a/67859384
function getTable (data) {
  logger.table(data)
  return (ts.read() || '').toString()
}

const table = (a) => {
  a.rows.forEach((i) => delete i["_tableRows"]);
  a.rows.forEach((i) => delete i["_groupedValues"]);
  const out = [];
  for (let r of a.rows) {
    out.push(r);
  }
  let table = getTable(out);
  let result = '';
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    result += `${r}\n`;
  }
  console.log(result);
}

export { csv, table }
