const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

async function getEth(address) {
    const result = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
      .then(result => result.json())
    if (result.status !== '1') {
        console.warn(`Failed to fetch ETH for address ${address}`);
        return 0;
    }
    return parseInt(result.result, 10);
}

async function getBlockNumber() {
    const d = Math.ceil(Date.now() / 1000);
    const result = await fetch(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${d}&closest=before&apikey=${etherscanApiKey}`).then(r => r.json())
    if (result.status !== '1') {
        console.warn(`Failed to fetch latest block number`);
        return 0;
    }
    return parseInt(result.result, 10);
}

async function getNormalTransactions(address, startBlock, endBlock, numberToGet, page) {
    const result = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${numberToGet}&sort=asc&apikey=${etherscanApiKey}`)
      .then(r => r.json());
    if (result.status !== '1') {
        console.warn(`Failed to fetch normal transactions for address ${address}`);
        return []
    }
    return result.result;
}

async function getInternalTransactions(address, startBlock, endBlock, numberToGet, page) {
    const result = await fetch(`https://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${numberToGet}&sort=asc&apikey=${etherscanApiKey}`)
      .then(r => r.json());
    if (result.status !== '1') {
        console.warn(`Failed to fetch internal transactions for address ${address}`);
        return []
    }
    return result.result;
}


function getEtherscanAddress(address) {
    return `https://etherscan.io/address/${address}`;
}

module.exports = {
    getEth,
    getEtherscanAddress,
    getNormalTransactions,
    getBlockNumber,
    getInternalTransactions,
}
