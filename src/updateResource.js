const db = require('./db')

/**
 * Performs UPDATE.
 *
 * @param {Model} Entity
 * @param {any[]} data
 *
 * @return {Set}
 */
module.exports = (Entity, data) => {
  const jobs = data.map(({ id, toUpdate }) => {
    return new Promise((resolve) => {
      db(Entity.table)
        .where('id', id)
        .update(toUpdate)
        .then(resolve)
        .catch(e => console.log(e, resolve()))
    })
  })

  return Promise.all(jobs)
}
