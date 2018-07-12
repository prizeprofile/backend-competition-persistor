# AWS Lambda: Competition Saver

_AUTHOR: MIchael Bausano_

Listens to an SNS topic which is published to by Twitter Scraper lambda.

Belongs to a VPN so that it can obtain Aurora write permissions. Populates promoters and competitions to database.

```
event.Records[0].Sns.message = {
    ...
    "region_id": Integer,
    "competitions": Object[]
}
```

## Deployment
_TODO: Use some AWS automation tool rather than grunt._
Deploy staging with `grunt deploy` and production with `grunt deploy_prod`.

## Tests
Yet to be written.