// TODO: Default region.
const AWS = require('aws-sdk')
const SQS = new AWS.SQS({ region: 'eu-west-1' })

exports.handler = async (event, context, callback) => {
  /**
   * A message is stringified object that contains
   * properties region_id, params and max_id.
   * @type {Object}
   */
  const message = JSON.parse(event.Records.pop().Sns.Message)
  const region_id = parseInt(message.region_id)

  /**
   * Tweet collection based on settings from message sorted by tweet id.
   * TODO: Handle errors.
   * @type {Object[]}
   */
  const tweets = await require('./src/fetcher')(message)
  const tweets_count = tweets.length

  // Sends a message to result queue which is read by
  // the scheduler and creates the cycle.
  // TODO: Error handling.
  SQS.sendMessage({
    MessageBody: JSON.stringify({
      region_id,
      tweets_count,
      max_id: tweets_count ? tweets[tweets_count - 1].id_str : null
    }),
    QueueUrl: process.env.TASK_QUEUE_URL
  })

  /**
   * Parses the tweets array and saves it into the database.
   * @throws {Error}
   * @type {Promise<void>}
   */
  const competitions = await require('./src/parser')(tweets, region_id)

  // Pushes parsed competitions to a queue that handles saving them to DB.
  // TODO: Error handling.
  SQS.sendMessage({
    MessageBody: JSON.stringify({ region_id, competitions }),
    QueueUrl: process.env.DB_QUEUE_URL
  })

  callback(null, 'success')
}
