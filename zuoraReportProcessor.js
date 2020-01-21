const csv = require('async-csv');
const fs = require('fs').promises;
 
async function readCSVFile(csvFilePath) {
    return new Promise(async function(resolve, reject) {
        const csvString = await fs.readFile(csvFilePath, 'utf16le');
        const rows = await readCSVString(csvString)
        resolve(rows)
    });
}

async function readCSVString(csvString) {
    return new Promise(async function(resolve, reject) {
        const rows = await csv.parse(csvString, { delimiter: '\t', columns: true });
        console.log(`Parsed ${rows.length} rows`)
        resolve(rows)
    });
}

async function hans() {
    var renewals = await readCSVFile('test.csv')
    renewals.forEach(element => {
        console.log(element)
    });
    console.log(`Parsed ${renewals.length} rows`)
}

hans()

module.exports = {readCSVFile, readCSVString}