const Promoter = require('./models/Promoter')
const Competition = require('./models/Competition')
const persistResourse = require('./persistResourse')

module.exports = (region, tweets) => {
  // Saves promoters to database or fetches their id if they're already stored.
  return persistResourse(Promoter, tweets.map(({ data }) => data.promoter))
    .then(ids => new Promoter().mapIds(ids))
    // Updates competitions array with promoter_id.
    .then((promoters) => tweets
      .map((comp) => {
        comp.region_id = region
        comp.tweet_id = comp.data.tweet.tweet_id
        comp.promoter_id = promoters[comp.data.promoter.twitter_id]

        return comp
      })
      .filter(comp => Number.isInteger(comp.promoter_id)))
    // Saves all competitions to the database.
    .then(competitions => persistResourse(Competition, competitions))
}
