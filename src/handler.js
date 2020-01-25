/* eslint-disable no-console */

const AWS = require('aws-sdk')
const dateFormat = require('dateformat')
const zuoraReportProcessor = require('./libs/zuoraReportProcessor')
const bssReportProcessor = require('./libs/bssReportProcessor')
const commonFunctions = require('./libs/commonFunctions')
// const slack = require('./libs/slackNotifier')

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'us-west-2',
})

module.exports.processZuoraEmail = async event => {
  // console.log('Received event:', JSON.stringify(event, null, 2))
  const record = event.Records[0]
  const dateString = dateFormat(new Date(record.eventTime), 'dd_mm_yyyy')
  let testPassedFlag = false
  const summary = { message: `\nReport: ${dateString}\n` }

  try {
    const zuoraReport = await zuoraReportProcessor.parseZuoraEmailFromSES(s3, record)

    if (zuoraReport !== null) {
      if (Object.keys(zuoraReport).length > 0) {
        commonFunctions.log(summary, `Zuora: ${Object.keys(zuoraReport).length} msns in bill run on ${dateString}\n`)

        // Read BSS Report
        const bssReport = await bssReportProcessor.parseBSSReportFromS3(s3, dateString)
        if (bssReport !== null) {
          if (Object.keys(bssReport).length > 0) {
            commonFunctions.log(summary, `BSS: ${Object.keys(bssReport).length} msns in bill run on ${dateString}\n`)

            // Reconcile
            const mismatches = commonFunctions.reconcile(zuoraReport, bssReport)
            if (Object.keys(mismatches).length > 0) {
              Object.keys(mismatches).forEach(key => {
                commonFunctions.log(summary, `${mismatches[key].mismatch_reason}\n`)
              })
            } else {
              testPassedFlag = true
            }

            commonFunctions.log(summary, `\nNumber of mismatches: ${Object.keys(mismatches).length}`)
            commonFunctions.log(summary, `\nReconcilation result: ${testPassedFlag ? 'PASS' : 'FAIL'}\n`)
            console.log(summary.message)

            // Slack the results
            // await slack.notify(summary.message, testPassedFlag)
          } else {
            commonFunctions.log(summary, 'BSS report shows no renewals\n')
            // await slack.notify(`${summaryMessage}`, testPassedFlag)
          }
        }
      } else {
        commonFunctions.log(summary, 'Zuora report shows no renewals\n')
        // await slack.notify(summary.message, testPassedFlag)
      }
    } else {
      commonFunctions.log(summary, `Zuora: No attachment in Zuora report for ${dateString}\n`)
      // await slack.notify(summary.message, testPassedFlag)
    }
    return { status: 'success' }
  } catch (Error) {
    console.log(Error, Error.stack)
    // await slack.notify(`${Error.toString()}`, testPassedFlag)
    return Error
  }
}
