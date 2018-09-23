const db = require('./db')

/**
 * Performs INSERT OR IGNORE.
 *
 * @param {Model} Entity
 * @param {any[]} data
 *
 * @return {Set}
 */
module.exports = (Entity, data) => {
  const model = new Entity()

  // Prepares the rows object to batch insert new data.
  let rows = getUnique(data, model.unique)
    // Maps resource information to the database fields.
    .map(resource => new Entity().from(resource).fields())

  if (! rows.length) {
    throw new Error('No data received.')
  }

  const insert = db.insert(rows, 'id')
    .into(model.table)
    .toString()
    .replace('insert', 'INSERT IGNORE')

  return new Promise((resolve, reject) => db.raw(insert).then(resolve).catch(reject))
    // Gets all unique ids from the batch.
    .then(() => Array.from(new Set(data.map(item => item[model.unique]))))
}

/**
 * Returns unique resources.
 *
 * @param {any[]} source
 * @param {String} unique
 *
 * @return {any[]}
 */
const getUnique = (source, unique) => {
  const length = source.length, result = [], seen = new Set()

  outer:
  for (let index = 0; index < length; index++) {
    const resource = source[index]

    if (seen.has(resource[unique])) {
      continue outer
    }

    seen.add(resource[unique])
    result.push(resource)
  }

  return result
}
