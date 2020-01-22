const csv = require('async-csv');
const fs = require('fs').promises;
const stripBom = require('strip-bom');
 
async function readCSVFile(csvFilePath) {
    return new Promise(async function(resolve, reject) {
        const csvString = await fs.readFile(csvFilePath, 'utf16le');
        const rows = await readCSVString(csvString)
        resolve(rows)
    });
}

async function readCSVString(csvString) {
    return new Promise(async function(resolve, reject) {
        const rows = await csv.parse(csvString, { delimiter: '\t', columns: true,
        cast: function(value, context){
            if(context.header){
              return stripBom(value)
            }else{
              return value
            }
          }, trim: true
        });
        resolve(rows)
    });
}

function summaryList(rows) {
    var summary = {}
    rows.forEach(element => {
        summary[element['Subscription: Market Service Reference Id']] = {
            'msn': element['Subscription: Market Service Reference Id'],
            'name': element['Account: Name'],
            'phoneid': element['Subscription: Service Reference Id'],
            'clientid': element['Account: Account Number'].split('-')[0],
            'subscription': element['Subscription: Name'],
            'amount': element['Invoice: Amount']
        }
    })
    return summary
}

module.exports = {readCSVFile, readCSVString, summaryList}