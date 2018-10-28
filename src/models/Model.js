
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
}
