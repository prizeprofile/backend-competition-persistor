const Model = require('./Model')

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
      source_id: 0,
      text: tweet.text,
      posted: tweet.posted,
      comments: tweet.comments,
      retweets: tweet.retweets,
      tweet_id: tweet.tweet_id,
      end_date: object.end_date,
      favorites: tweet.favorites,
      promoter_id: object.promoter_id,
      region_id: process.env.REGION_ID,
      entry_methods: JSON.stringify(object.entry_methods),
    }

    return this
  }
}
