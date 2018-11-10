const Model = require('./Model')

module.exports = class Promoter extends Model {
  /**
   * Table name.
   * @var {String}
   */
  static get table () {
    return 'promoters'
  }

  /**
   * Unique identifier.
   * @var {String}
   */
  static get unique () {
    return 'resource_id'
  }

  /**
   * Returns new model from given object.
   * @param {Object} object
   * @return {Model}
   */
  from (object) {
    this._fields = Object.assign({}, object, { verified: object.verified ? 1 : 0 })

    return this
  }
}
