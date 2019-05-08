const Route53Service = require('aws-sdk').Route53;
const route53 = new Route53Service();

function respond(cb, statusCode, body) {
  cb(null, {
    statusCode,
    body: body && JSON.stringify(body)
  });
}

async function handler(event, context, cb) {
  const { ip, domain, secret, TTL = 300 } = JSON.parse(event.body);

  if (!ip || !domain) return respond(cb, 400);

  if (secret === undefined || secret !== process.env.SECRET)
    return respond(cb, 403);

  const params = {
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: domain,
            ResourceRecords: [
              {
                Value: ip
              }
            ],
            TTL,
            Type: 'A'
          }
        }
      ],
      Comment: 'Web server for example.com'
    },
    HostedZoneId: process.env.HostedZoneId
  };

  try {
    const result = await route53.changeResourceRecordSets(params).promise();
    respond(cb, 200, result);
  } catch (e) {
    respond(cb, 500, e.message);
  }
}

module.exports.handler = handler;
