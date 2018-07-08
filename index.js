
exports.handler = async (event, context, callback) => {
  /**
   * A message is stringified object that contains
   * an array of competitions.
   * @type {Object}
   */
  const message = JSON.parse(event.Records.pop().Sns.Message)
  console.log('message', message)

  callback(null, 'success')
}
