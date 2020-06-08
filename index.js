const fs = require('fs');

const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const getStream = require('get-stream');

const {geocode} = require('./src/geo');

async function main() {
    try {
        console.log(await geocode('11 N 4th St #1810, St. Louis, MO 63102'));
        // const data = await readCsv('ranktribe_guessed_zips.csv');
        // const geoData = await Promise.all(data.map((row)=>{return geocode(row.address)}));
        // await writeCsv(geoData);
    } catch (error) {
        console.error(`Failed to run index.js: ${error.message}`);
    }
}

async function readCsv(csvFile) {
    const uploadArray = [];
    
    const streamData = await getStream.array(fs.createReadStream(csvFile)
        .pipe(csv()))
    return streamData;
}

async function writeCsv(data) {
  const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'name', title: 'Name'},
      {id: 'surname', title: 'Surname'},
      {id: 'age', title: 'Age'},
      {id: 'gender', title: 'Gender'},
    ]
  });
  await csvWriter.writeRecords(data);
}

main();