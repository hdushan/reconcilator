var zuoraReportProcessor = require('./zuoraReportProcessor');

async function hans() {
    var renewals = await zuoraReportProcessor.readCSVFile('test.csv')
    var summary = zuoraReportProcessor.summaryList(renewals)

    for(var key in summary) {
        console.log(summary[key])
    }
      
    console.log(`Parsed ${renewals.length} rows, ${Object.keys(summary).length} unique msns`)
}

hans()