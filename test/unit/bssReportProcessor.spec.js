import { describe, it } from 'mocha'
import { expect } from 'chai'

const commonFunctions = require('../../src/libs/commonFunctions')
const bssReportProcessor = require('../../src/libs/bssReportProcessor')

describe('BSS Report Processor', () => {
  it('returns right number of renewals for non empty report file', async () => {
    const renewals = await commonFunctions.readCSVFile('./test/fixtures/bss_report_sample.csv')
    const summary = bssReportProcessor.summaryList(renewals)
    expect(renewals.length).to.equal(10)
    expect(Object.keys(summary).length).to.equal(8)
  })

  it('returns zero renewals for empty report file', async () => {
    const renewals = await commonFunctions.readCSVFile('./test/fixtures/bss_report_empty_sample.csv')
    const summary = bssReportProcessor.summaryList(renewals)
    expect(renewals.length).to.equal(0)
    expect(Object.keys(summary).length).to.equal(0)
  })
})
