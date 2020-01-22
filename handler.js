'use strict';

const AWS = require('aws-sdk');
var zuoraReportProcessor = require('./zuoraReportProcessor');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'us-west-2',
});

const simpleParser = require('mailparser').simpleParser;

module.exports.processZuoraEmail = async (event) => {
  // console.log('Received event:', JSON.stringify(event, null, 2));
  const record = event.Records[0];

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
    if(email.attachments.length > 0) {
      var csvString = email.attachments[0].content.toString('utf16le')
      console.log('attachment content:', csvString);
      var renewals = await zuoraReportProcessor.readCSVString(csvString)
      var summary = zuoraReportProcessor.summaryList(renewals)
      for(var key in summary) {
        console.log(summary[key])
      }
      console.log(`Parsed ${renewals.length} rows, ${Object.keys(summary).length} unique msns`)
    }
    return { status: 'success' };
  } catch (Error) {
    console.log(Error, Error.stack);
    return Error;
  }
};
