const NodeGeocoder = require('node-geocoder');
const { backOff } = require("exponential-backoff");

const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  formatter: null // 'gpx', 'string', ...
});

async function geocode(address) {
  try {
    return await backOff(() => geocoder.geocode(address), {
      numOfAttempts: 3,
      // retry: () => console.warn(`Retrying ${address} ...`),
    });
  } catch (error) {
    console.error(`Failed to fetch geocode for address ${address} with error: ${error.message}`);
    return Promise.resolve({});
  }
}

module.exports = {
    geocode: geocode,
};
