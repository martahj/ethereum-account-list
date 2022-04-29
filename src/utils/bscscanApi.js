const CommonApiFactory = require('./commonApiFactory')

const url = 'https://api.bscscan.com';
const apiKey = process.env.BSC_API_KEY;

module.exports = new CommonApiFactory(url, apiKey)
