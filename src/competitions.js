const db = require('./db')
const table = 'competitions'
const Competition = require('./models/Competition')

/**
 * Saves all competitions to database if they don't exist yet.
 * @param {Object[]} competitions 
 */
module.exports = async (competitions) => {
  // Gets all ids from the batch.
  let ids = competitions.map(({ data }) => data.tweet.tweet_id)

  // This object will hold tweet_id => id mapping.
  const mapping = await new Competition().mapIds(ids, db)

  // Prepares the rows object to batch insert new competitions.
  let rows = competitions
    // Filters out existing competitions.
    .filter(({ data }) => !mapping[data.tweet.tweet_id])
    // Gets rid of duplicit competitions.
    .filter((competition, index, self) => {
      return index === self.findIndex((t) => {
        return t.data.tweet.tweet_id === competition.data.tweet.tweet_id
      })
    })
    // Maps competition information to the database fields.
    .map(competition => new Competition().from(competition).fields())
  
  // Saves all competitions and closes the connection.
  return new Promise((resolve, reject) => {
    db.insert(rows)
      .into(table)
      .then(() => db.destroy())
      .then(resolve)
      .catch(reject)
  })
}