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

    this._fields = {
      comments: 0,
      source_id: 0,
      preview: object.media,
      retweets: tweet.retweets,
      tweet_id: tweet.tweet_id,
      end_date: object.end_date,
      favorites: tweet.favorites,
      text: utf8.encode(tweet.text),
      promoter_id: object.promoter_id,
      region_id: object.region_id,
      posted: new Date(tweet.posted).toISOString(),
      entry_methods: JSON.stringify(object.entry_methods),
    }

    return this
  }
}
