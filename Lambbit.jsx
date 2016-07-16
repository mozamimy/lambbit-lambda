import AWS from 'aws-sdk';

exports.handler = function(event, context) {
  const bucketName = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  const s3Bucket = new AWS.S3({ params: { Bucket: bucketName } });

  const s3Params = {
    Key: key
  };

  s3Bucket.getObject(s3Params, function(err, data) {
    if (err) {
      console.error('Failed to get an object: ', err);
      context.fail();
    } else {
      const metadata = {};
      metadata['to'] = data.Metadata.to;
      metadata['from'] = data.Metadata.from;
      metadata['subject'] = data.Metadata.subject;
      metadata['body'] = data.Metadata.body;
      metadata['expires'] = data.Metadata.expires;

      const params = { Bucket: bucketName, Key: key, Expires: Number(metadata['expires']) };
      const fileUrl = s3Bucket.getSignedUrl('getObject', params);

      const ses = new AWS.SES( { sslEnabled: true, region: 'us-east-1' });

      const emailParams = {
        Source: metadata['from'],
        Destination: {
          ToAddresses: [metadata['to']]
        },
        Message: {
          Subject: {
            Data: metadata['subject']
          },
          Body: {
            Text: {
              Data: metadata['body'] + '\n\n' + fileUrl
            }
          }
        }
      };

      ses.sendEmail(emailParams, function(err, data) {
        if (err) {
          console.error('Failed to send an email: ', err);
          context.fail();
        } else {
          console.log('Success to send an email: ', data);
        }
      });
    }
  });
};
