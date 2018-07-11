const db = require('./db')
const table = 'promoters'
const Promoter = require('./models/Promoter')

/**
 * Saves promoters to database or fetches their id if they're already stored.
 * @param {Object[]} promoters 
 */
module.exports = async (promoters) => {
  // Gets all ids from the batch.
  let ids = promoters.map(({ twitter_id }) => twitter_id)

  // This object will hold twitter_id => id mapping.
  //const mapping = await new Promoter().mapIds(ids, db)

  const mapping = {}

  if (ids.length) {
    await db.select('id', 'twitter_id')
      .from(table)
      .whereIn('twitter_id', ids)
      .then(res => res.forEach(row => mapping[row.twitter_id] = row.id))
  }

  // Prepares the rows object to batch insert new promoters.
  let rows = promoters
    // Filters out existing promoters.
    .filter(({ twitter_id }) => !mapping[twitter_id])
    // Gets rid of duplicit promoters.
    .filter((promoter, index, self) => {
      return index === self.findIndex(t => t.twitter_id === promoter.twitter_id)
    })
    // Maps promoter information to the database fields.
    .map(promoter => new Promoter().from(promoter).fields())

  console.log(table, rows)

  if (rows.length) {
    await db.batchInsert(table, rows, 100)
    .returning('id')
    // InnoDB returns first id of last batch inserted.
    // Since auto increment is activated and db is locked, we can
    // assume that ids of every competition is going to be one higher
    // then of the previous one.
    .then((id) => {
      for (let i = id; id < id + rows.length; i++) {
        mapping[rows[i - id]] = i
      }
    })
  }
  
  return mapping
}
