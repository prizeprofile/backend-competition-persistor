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
  let rows = data
    // Gets rid of duplicit data.
    .filter((resource, index, self) => {
      return index === self.findIndex(t => t[model.unique] === resource[model.unique])
    })
    // Maps resource information to the database fields.
    .map(resource => new Entity().from(resource).fields())

  if (! rows.length) {
    throw new Error('No data received.')
  }

  const insert = db.insert(rows, 'id')
    .into(model.table)
    .toString()
    .replace('insert', 'INSERT IGNORE')

  new Promise((resolve, reject) => db.raw(insert).then(resolve).catch(reject))
    // Gets all unique ids from the batch.
    .then(() => Array.from(new Set(data.map(item => item[model.unique]))))
}
