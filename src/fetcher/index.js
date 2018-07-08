const Twitter = require('twitter')
const Fetcher = require('./Fetcher')
const ParameterBag = require('./ParameterBag')

module.exports = async ({ since_id, params }) => {
  /**
   * Connects to Twitter as an app.
   * @type {Twitter}
   */
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
  })

  // Packs the bag with params sent from scheduler.
  const bag = new ParameterBag()
    .pack('since_id', since_id)
    .pack(params)
    
  // Fetches the tweets.
  return new Fetcher(client, bag).scrape()
}
