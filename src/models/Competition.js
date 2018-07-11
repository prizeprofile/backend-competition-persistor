const Model = require('./Model')
const utf8 = require('utf8')

module.exports = class Competition extends Model {
  /**
   * Table name.
   * @var {String}
   */
  get table () {
    return 'competitions'
  }

  /**
   * Unique identifier.
   * @var {String}
   */
  get unique () {
    return 'tweet_id'
  }

  /**
   * Returns new model from given object.
   * @param {Object} object
   * @return {Model}
   */
  from (object) {
    let tweet = object.data.tweet

    console.log('text', tweet.text)

    this._fields = {
      comments: 0,
      source_id: 0,
      text: utf8.encode(tweet.text),
      retweets: tweet.retweets,
      tweet_id: tweet.tweet_id,
      end_date: object.end_date,
      favorites: tweet.favorites,
      promoter_id: object.promoter_id,
      region_id: process.env.REGION_ID,
      posted: new Date(tweet.posted).toISOString(),
      entry_methods: JSON.stringify(object.entry_methods),
    }

    return this
  }
}
