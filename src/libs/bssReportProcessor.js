/* eslint-disable no-console */

const commonFunctions = require('./commonFunctions')

function summaryList(rows) {
  const summary = {}
  rows.forEach(element => {
    summary[element.msn] = {
      msn: element.msn,
      name: element.name,
      phoneid: element.phoneid,
      clientid: element.clientid,
      amount: element.amount,
    }
  })
  return summary
}

async function parseReportContents(reportFileContentsString) {
  const renewals = await commonFunctions.readCSVString(reportFileContentsString)
  if (renewals.length > 0) {
    const summary = summaryList(renewals)
    return summary
  }
  return null
}

async function parseReport(reportFile) {
  const renewals = await commonFunctions.readCSVFile(reportFile)
  if (renewals.length > 0) {
    const summary = summaryList(renewals)
    return summary
  }
  return null
}

async function parseBSSReportFromS3(s3, datestamp) {
  const bssReportFromS3 = {
    Bucket: 'bss-billrun-daily-reports',
    Key: `bss_report_sample.csv`,
  }
  console.log(datestamp)
  const bssReportFile = await s3.getObject(bssReportFromS3).promise()
  const bssReportContentsString = bssReportFile.Body.toString()
  const bssReport = await parseReportContents(bssReportContentsString)
  return bssReport
}

module.exports = { summaryList, parseReportContents, parseReport, parseBSSReportFromS3 }
