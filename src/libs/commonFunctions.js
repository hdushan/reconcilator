/* eslint-disable func-names */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */

const csv = require('async-csv')
const fs = require('fs').promises
const stripBom = require('strip-bom')

async function readCSVString(csvString, delimiter = ',') {
  return new Promise(async function(resolve, reject) {
    try {
      const rows = await csv.parse(csvString, {
        delimiter,
        columns: true,
        cast(value, context) {
          if (context.header) {
            return stripBom(value)
          }
          return value
        },
        trim: true,
      })
      resolve(rows)
    } catch (Error) {
      console.log(Error, Error.stack)
      reject(Error)
    }
  })
}

async function readCSVFile(csvFilePath, encoding = 'utf8', delimiter = ',') {
  return new Promise(async function(resolve, reject) {
    try {
      const csvString = await fs.readFile(csvFilePath, encoding)
      const rows = await readCSVString(csvString, delimiter)
      resolve(rows)
    } catch (Error) {
      console.log(Error, Error.stack)
      reject(Error)
    }
  })
}

function reconcile(zuoraReport, bssReport) {
  const mismatches = {}
  Object.keys(zuoraReport).forEach(key => {
    if (Object.keys(bssReport).includes(key)) {
      if (zuoraReport[key].amount !== bssReport[key].amount) {
        mismatches[key] = zuoraReport[key]
        mismatches[key].mismatch_reason = `${key}: Invoice amount mismatch!! Zuora: ${zuoraReport[key].amount}, BSS: ${bssReport[key].amount}`
      }
    } else {
      mismatches[key] = zuoraReport[key]
      mismatches[key].mismatch_reason = `${key}: MSN is in Zuora bill run, but not in BSS bill run!!`
    }
  })
  return mismatches
}

/* eslint no-param-reassign: ["error", { "props": false }] */
function log(summary, message) {
  console.log(message.toString())
  summary.message += message.toString()
}

module.exports = { readCSVString, readCSVFile, reconcile, log }
