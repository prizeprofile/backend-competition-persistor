require('dotenv').config()
const AWS = require('aws-sdk')
const update = require('./src/update')
const persist = require('./src/persist')
const consumer = require('sqs-consumer')

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_TOKEN,
  secretAccessKey: process.env.AWS_ACCESS_TOKEN_SECRET
})

const app = consumer.create({
  sqs: new AWS.SQS(),
  queueUrl: process.env.SQS_PERSISTOR,
  async handleMessage ({ Body }, done) {
    const event = JSON.parse(Body)

    const method = {
      POST: persist,
      PUT: update
    }[event.method]

    if (
      !method ||
      !Array.isArray(event.competitions) ||
      !event.competitions.length
    ) return done()

    try {
      console.log(`[${new Date().toISOString()}][${event.method}] New Batch of ${event.competitions.length} competitions.`)
      await method(event)
    } catch (e) {
      console.log(`[${new Date().toISOString()}][${e.name}] ${e.message}`)
    } finally {
      done()
    }
  }
})

app.start()
