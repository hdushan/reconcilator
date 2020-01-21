var zuoraReportProcessor = require('./zuoraReportProcessor');

async function hans() {
    var renewals = await zuoraReportProcessor.readCSVFile('test.csv')
    renewals.forEach(element => {
        console.log(element)
    });
    console.log(`Parsed ${renewals.length} rows`)
}

hans()