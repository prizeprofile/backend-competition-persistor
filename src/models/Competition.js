const Model = require('./Model')
const utf8 = require('utf8')

module.exports = class Competition extends Model {
  /**
   * Table name.
   * @var {String}
   */
  static get table () {
    return 'competitions'
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
    let resource = object.data.resource

    this._fields = {
      source_id: object.source_id,
      preview: object.media,
      entrants: object.entrants,
      resource_id: resource.resource_id,
      end_date: object.end_date,
      text: resource.text,
      promoter_id: object.promoter_id,
      region_id: object.region_id,
      posted: new Date(resource.posted).toISOString(),
      entry_methods: JSON.stringify(object.entry_methods),
    }

    return this
  }
}
