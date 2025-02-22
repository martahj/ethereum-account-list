const CommonApiFactory = require('./commonApiFactory')

const url = 'https://api.etherscan.io';
const apiKey = process.env.ETHERSCAN_API_KEY;

module.exports = new CommonApiFactory(url, apiKey)
