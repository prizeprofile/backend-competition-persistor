const db = require('./db')
const Promoter = require('./models/Promoter')
const Competition = require('./models/Competition')
const persistResourse = require('./persistResourse')

/**
 * Maps unique identifiers to primary keys.
 *
 * @param {String[]|Number[]} ids
 *
 * @return {Promise<Object>}
 */
const mapIds = (ids, Entity) => {
  return new Promise((resolve, reject) => {
    const mapping = {}

    db.select('id', Entity.unique)
      .from(Entity.table)
      .whereIn(Entity.unique, ids)
      .then(res => res.forEach(row => mapping[row[Entity.unique]] = row.id))
      .then(() => resolve(mapping))
      .catch(reject)
  })
}

module.exports = ({ competitions, region_id }) => {
  // Saves promoters to database or fetches their id if they're already stored.
  return persistResourse(Promoter, competitions.map(({ data }) => data.promoter))
    .then(ids => mapIds(ids, Promoter))
    // Updates competitions array with promoter_id.
    .then((promoters) => competitions
      .map((comp) => {
        comp.region_id = region_id
        comp.resource_id = comp.data.resource.resource_id
        comp.promoter_id = promoters[comp.data.promoter.resource_id]

        return comp
      })
      .filter(comp => Number.isInteger(comp.promoter_id)))
    // Saves all competitions to the database.
    .then(data => persistResourse(Competition, data))
}
