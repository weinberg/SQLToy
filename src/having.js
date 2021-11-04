/**
 * HAVING
 */

// Having takes a column and a predicate - this is just like where but should be run after group by
const HAVING = (table, pred) => {
  return {
    name: table.name,
    rows: table.rows.filter(pred)
  }
}

export { HAVING }
