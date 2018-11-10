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
  // Prepares the rows object to batch insert new data.
  let rows = getUnique(data, Entity.unique)
    // Maps resource information to the database fields.
    .map(resource => new Entity().from(resource).fields())

  if (!rows.length) {
    throw new Error('No data received.')
  }

  return new Promise((resolve, reject) => db.select(Entity.unique)
    .from(Entity.table)
    // Checks for existing ids.
    .whereIn(Entity.unique, rows.map(r => r[Entity.unique]))
    .then(resolve)
    .catch(reject))
    .then((existing) => {
      // Only inserts new resources.
      const toInsert = rows.filter(r => !existing.find(e => e[Entity.unique] === r[Entity.unique]))

      const query = db
        .insert(toInsert)
        .into(Entity.table)
        .toString()
        .replace('insert', 'INSERT IGNORE')

      // Execs an insert ignore query.
      return new Promise((resolve, reject) => db
        .raw(query)
        .then(resolve)
        .catch(reject))
    })
    // Gets all unique ids from the batch.
    .then(() => Array.from(new Set(data.map(item => item[Entity.unique]))))
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
