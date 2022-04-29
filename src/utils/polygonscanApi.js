const CommonApiFactory = require('./commonApiFactory')

const polygonUrl = 'https://api.polygonscan.com';
const polygonscanApiKey = process.env.POLYGONSCAN_API_KEY;

module.exports = new CommonApiFactory(polygonUrl, polygonscanApiKey)
