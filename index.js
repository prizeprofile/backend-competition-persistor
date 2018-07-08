const AWS = require('aws-sdk')
const SQS = new AWS.SQS({ region: 'eu-west-1' })
const save = require('./src/save.js')

exports.handler = (event, context, callback) => {
  // SQS queue to pull competitions from.
  const QueueUrl = process.env.COMPETITIONS_QUEUE_URL

  // Compose params for SQS reading.
  const params = {
   AttributeNames: ['SentTimestamp'],
   MessageAttributeNames: ['All'],
   MaxNumberOfMessages: 10,
   VisibilityTimeout: 0,
   WaitTimeSeconds: 0,
   QueueUrl,
  }

  return new Promise((resolve, reject) => {
    // Try to poll all messages.
    SQS.receiveMessage(params, (err, data) => {
      // If there was an error or if there were no messages, abort.
      err || ! data.Messages.length ? reject(err) : resolve(data.Messages)
    })
  })
    // Save all competitions.
    .then((msgs) => Promise.all(msgs.map(msg => save(msg)))
    // Send the ReceiptHandle to next clause.
    .then(() => msgs.pop().ReceiptHandle))
    .then((ReceiptHandle) => new Promise((resolve, reject) => {
      // Delete messages that were received.
      SQS.deleteMessage({ QueueUrl, ReceiptHandle }, (err, data) => {
        err ? reject(err) : resolve()
      })
    }))
    .catch(e => console.error('Exit with', e))
}
