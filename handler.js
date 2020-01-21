'use strict';

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'us-west-2',
});

const simpleParser = require('mailparser').simpleParser;

module.exports.processZuoraEmail = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const record = event.Records[0];
  console.log(record);

  const request = {
    Bucket: record.s3.bucket.name,
    Key: record.s3.object.key,
  };

  console.log('Bucket:', record.s3.bucket.name);
  console.log('Key:', record.s3.object.key);

  try {
    const data = await s3.getObject(request).promise();
    const email = await simpleParser(data.Body);
    console.log('date:', email.date);
    console.log('subject:', email.subject);
    console.log('body:', email.text);
    console.log('from:', email.from.text);
    console.log('attachments:', email.attachments);
    console.log('attachment content:', email.attachments[0].content.toString());
    return { status: 'success' };
  } catch (Error) {
    console.log(Error, Error.stack);
    return Error;
  }
};
