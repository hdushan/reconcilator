const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const stripBom = require('strip-bom-stream');
 
fs.createReadStream('data.csv')
  .pipe(stripBom())
  .pipe(csv({ separator: '\t' }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });