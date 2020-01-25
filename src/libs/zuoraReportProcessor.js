/* eslint-disable no-console */

const { simpleParser } = require('mailparser')
const commonFunctions = require('./commonFunctions')

function summaryList(rows) {
  const summary = {}
  rows.forEach(element => {
    summary[element['Subscription: Market Service Reference Id']] = {
      msn: element['Subscription: Market Service Reference Id'],
      name: element['Account: Name'],
      phoneid: element['Subscription: Service Reference Id'],
      clientid: element['Account: Account Number'].split('-')[0],
      subscription: element['Subscription: Name'],
      amount: element['Invoice: Amount'],
    }
  })
  return summary
}

async function parseEmail(email) {
  console.log(`Parsing email received at ${email.date} from ${email.from.text}`)
  console.log('Email subject:', email.subject)
  if (email.attachments.length > 0) {
    const csvString = email.attachments[0].content.toString('utf16le')
    const renewals = await commonFunctions.readCSVString(csvString, '\t')
    const summary = summaryList(renewals)
    return summary
  }
  return null
}

async function parseZuoraEmailFromSES(s3, sesEventRecord) {
  const zuoraReportS3request = {
    Bucket: sesEventRecord.s3.bucket.name,
    Key: sesEventRecord.s3.object.key,
  }
  const data = await s3.getObject(zuoraReportS3request).promise()
  const email = await simpleParser(data.Body)
  const zuoraReport = await parseEmail(email)
  return zuoraReport
}

module.exports = { summaryList, parseEmail, parseZuoraEmailFromSES }
