const Model = require('./Model')

module.exports = class Promoter extends Model {
  /**
   * Table name.
   * @var {String}
   */
  get table () {
    return 'promoters'
  }

  /**
   * Unique identifier.
   * @var {String}
   */
  get unique () {
    return 'twitter_id'
  }

  /**
   * Returns new model from given object.
   * @param {Object} object
   * @return {Model}
   */
  from (object) {
    this._fields = { ...object, verified: object.verified ? 1 : 0 }

    return this
  }
}