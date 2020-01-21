const csv = require('async-csv');
const fs = require('fs').promises;
 
async function readCSV(csvFileName) {
    return new Promise(async function(resolve, reject) {
        const csvString = await fs.readFile(csvFileName, 'utf16le');
        const rows = await csv.parse(csvString, { delimiter: '\t', columns: true });
        console.log(`Parsed ${rows.length} rows`)
        resolve(rows)
    });
}

async function hans() {
    var renewals = await readCSV('test.csv')
    renewals.forEach(element => {
        console.log(element)
    });
    console.log(`Parsed ${renewals.length} rows`)
}

hans()