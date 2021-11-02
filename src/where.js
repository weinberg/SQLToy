// WHERE - where is run after a FROM/JOIN to reduce the output set

/**
 * WHERE takes a table and a predicate and reduces rows to the ones which match the predicate
 */

const WHERE = (table, pred) => {
  return {
    name: table.name,
    rows: table.rows.filter(pred)
  };
}

export { WHERE }
