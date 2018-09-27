require('dotenv').config()
const AWS = require('aws-sdk')
const persist = require('./src')
const consumer = require('sqs-consumer')

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_TOKEN,
  secretAccessKey: process.env.AWS_ACCESS_TOKEN_SECRET
})

const app = consumer.create({
  sqs: new AWS.SQS(),
  queueUrl: process.env.SQS_PERSISTOR,
  handleMessage ({ Body }, done) {
    const event = JSON.parse(Body)

    if (isNaN(event.region_id) || !Array.isArray(event.competitions) || !event.competitions.length) {
      return done()
    }

    persist(event.region_id, event.competitions)
      .then(_ => done())
      .catch(_ => done())
  }
})

app.start()
