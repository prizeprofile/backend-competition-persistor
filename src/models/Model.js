const db = require('../db')

module.exports = class Model {
  /**
   * Returns new model from given object.
   * @param {Object} object
   * @return {Model}
   */
  from (object) { throw new Error('Not implemented') }

  /**
   * Returns a flat object with fields and values.
   * @return {Object}
   */
  fields () {
    return this._fields
  }

  /**
   * Maps unique identifiers to primary keys.
   *
   * @param {String[]|Number[]} ids
   *
   * @return {Promise<Object>}
   */
  mapIds (ids) {
    return new Promise((resolve, reject) => {
      const mapping = {}

      db.select('id', this.unique)
        .from(this.table)
        .whereIn(this.unique, ids)
        .then(res => res.forEach(row => mapping[row[this.unique]] = row.id))
        .then(() => resolve(mapping))
        .catch(reject)
    })
  }
}
