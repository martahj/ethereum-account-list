const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


class CommonApiFactory {
    constructor(url, apiKey) {
        this.url = url;
        this.apiKey = apiKey
    }

    async getBalance(address) {
        const result = await fetch(`${this.url}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`)
        .then(result => result.json())
      if (result.status !== '1') {
          // console.warn(`Failed to fetch ETH for address ${address}`);
          return 0;
      }
      return parseInt(result.result, 10);
    }

    async getBlockNumber() {
        const d = Math.ceil(Date.now() / 1000);
        const result = await fetch(`${this.url}/api?module=block&action=getblocknobytime&timestamp=${d}&closest=before&apikey=${this.apiKey}`).then(r => r.json())
        if (result.status !== '1') {
            // console.warn(`Failed to fetch latest block number`);
            return 0;
        }
        return parseInt(result.result, 10);
    }

    async getNormalTransactions(address, startBlock, endBlock, numberToGet, page) {
        const result = await fetch(`${this.url}/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${numberToGet}&sort=desc&apikey=${this.apiKey}`)
          .then(r => r.json());
        if (result.status !== '1') {
            // console.warn(`Failed to fetch normal transactions for address ${address}`);
            return []
        }
        return result.result;
    }
    
    async getInternalTransactions(address, startBlock, endBlock, numberToGet, page) {
        const result = await fetch(`${this.url}/api?module=account&action=txlistinternal&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${numberToGet}&sort=desc&apikey=${this.apiKey}`)
          .then(r => r.json());
        if (result.status !== '1') {
            // console.warn(`Failed to fetch internal transactions for address ${address}`);
            return []
        }
        return result.result;
    }
    
    
    getLink(address) {
        return `${this.url}/address/${address}`;
    }
};


module.exports = CommonApiFactory;