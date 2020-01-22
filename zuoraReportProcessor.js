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
            'clientid': element['Account: Account Number'],
            'subscription': element['Subscription: Name'],
            'amount': element['Invoice: Amount']
        }
    })
    return summary
}

async function hans() {
    var renewals = await readCSVFile('test.csv')
    var summary = summaryList(renewals)

    for(var key in summary) {
        console.log(summary[key])
    }
      
    console.log(`summary has ${Object.keys(summary).length} rows`)
}

hans()

module.exports = {readCSVFile, readCSVString, summaryList}