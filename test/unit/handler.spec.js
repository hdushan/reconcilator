import { describe, it } from 'mocha'
import { expect } from 'chai'

const { simpleParser } = require('mailparser')
const fs = require('fs').promises

const zuoraReportProcessor = require('../../src/libs/zuoraReportProcessor')

describe('Zuora Report Processor', () => {
  it('returns right number of renewals for non empty report file', async () => {
    const emailFileSample = await fs.readFile('./test/fixtures/email_sample')
    const email = await simpleParser(emailFileSample)
    const zuoraReport = await zuoraReportProcessor.parseEmail(email)

    expect(Object.keys(zuoraReport).length).to.equal(10)
  })
})
