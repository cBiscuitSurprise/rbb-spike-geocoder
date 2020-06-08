const fs = require('fs');

const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const getStream = require('get-stream');

const {geocode} = require('./src/geo');

const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'name', title: 'name'},
    {id: 'imageUrl', title: 'imageUrl'},
    {id: 'categories', title: 'categories'},
    {id: 'address', title: 'address'},
    {id: 'description', title: 'description'},
    {id: 'link', title: 'link'},
    {id: 'street', title: 'street'},
    {id: 'city', title: 'city'},
    {id: 'state', title: 'state'},
    {id: 'zip', title: 'zip'},
    {id: 'guessedCity', title: 'guessedCity'},
    {id: 'latitude', title: 'latitude'},
    {id: 'longitude', title: 'longitude'},
    {id: 'formattedAddress', title: 'formattedAddress'},
    {id: 'geoCountry', title: 'country'},
    {id: 'geoCity', title: 'city'},
    {id: 'geoState', title: 'state'},
    {id: 'geoZipcode', title: 'zipcode'},
    {id: 'geoStreetName', title: 'streetName'},
    {id: 'geoStreetNumber', title: 'streetNumber'},
    {id: 'geoCountryCode', title: 'countryCode'},
    {id: 'geoProvider', title: 'provider'},
  ]
});

async function main() {
    try {
        // console.log(await geocode('235 Dogwood Meadow Ct., St. Peters, MO'));
        const data = await readCsv('ranktribe_guessed_zips.csv');
        await iterateGently(data);
        // const geoData = await Promise.all(data.map((row)=>{return geocode(row.address)}));
        // await writeCsv(geoData);
    } catch (error) {
        console.error(`Failed to run index.js: ${error.message}`);
    }
}

async function iterateGently(data) {
  let geo;
  let last = new Date();
  let now = last;
  for (row of data.slice(0, 5)){
    // if we have to wait 1sec per request anyway, may as well write out to disk for each record...
    const rowOut = JSON.parse(JSON.stringify(row));
    geo = await geocode(row.address);
    await csvWriter.writeRecords([buildRow(row, geo)]);

    now = new Date();
    await delay(Math.max(0, (1000 - (now - last))));
    last = now;
    process.stdout.write(".");
  }
}

async function readCsv(csvFile) {
    const uploadArray = [];
    
    const streamData = await getStream.array(fs.createReadStream(csvFile)
        .pipe(csv()))
    return streamData;
}

async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve(), ms);
  });
}

function buildRow(row, geo) {
  return {
    name: row.name,
    imageUrl: row.imageUrl,
    categories: row.categories,
    address: row.address,
    description: row.description,
    link: row.link,
    street: row.street,
    city: row.city,
    state: row.state,
    zip: row.zip,
    guessedCity: row.guessedCity ,
    latitude: geo.latitude,
    longitude: geo.longitude,
    formattedAddress: geo.formattedAddress,
    geoCountry: geo.country,
    geoCity: geo.city,
    geoState: geo.state,
    geoZipcode: geo.zipcode,
    geoStreetName: geo.streetName,
    geoStreetNumber: geo.streetNumber,
    geoCountryCode: geo.countryCode,
    geoProvider: geo.provider,
  }
}

main();