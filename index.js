const route53 = new require('aws-sdk').Route53();

function respond(cb, statusCode, body) {
  cb({
    statusCode,
    body: body && JSON.stringify(body)
  });
}

async function handler(event, context, cb) {
  const { ip, domain, secret } = JSON.parse(event.body);

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
            TTL: 300,
            Type: 'A'
          }
        }
      ],
      Comment: 'Web server for example.com'
    },
    HostedZoneId: process.env.HostedZoneId
  };

  const result = await route53.changeResourceRecordSets(params).promise();

  respond(cb, 200, result);
}

module.exports.handler = handler;
