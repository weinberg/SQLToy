
// Helper output function
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

const table = (a) => {
  a.rows.forEach((i) => delete i["_tableRows"]);
  a.rows.forEach((i) => delete i["_groupedValues"]);
  const out = [];
  for (let r of a.rows) {
    out.push(r);
  }
  console.table(out);
}

export { csv, table }
