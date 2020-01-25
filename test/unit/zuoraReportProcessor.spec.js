import { describe, it } from 'mocha'
import { expect } from 'chai'

const commonFunctions = require('../../src/libs/commonFunctions')
const zuoraReportProcessor = require('../../src/libs/zuoraReportProcessor')

describe('Zuora Report Processor', () => {
  it('returns right number of renewals for non empty report file', async () => {
    const renewals = await commonFunctions.readCSVFile('./test/fixtures/zuora_report_sample.csv', 'utf16le', '\t')
    const summary = zuoraReportProcessor.summaryList(renewals)
    expect(renewals.length).to.equal(54)
    expect(Object.keys(summary).length).to.equal(9)
  })

  it('returns zero renewals for empty report file', async () => {
    const renewals = await commonFunctions.readCSVFile('./test/fixtures/zuora_report_empty_sample.csv', 'utf16le', '\t')
    const summary = zuoraReportProcessor.summaryList(renewals)
    expect(renewals.length).to.equal(0)
    expect(Object.keys(summary).length).to.equal(0)
  })
})
