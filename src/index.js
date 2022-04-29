/* eslint-disable camelcase */
/* eslint-disable no-console */
const path = require('path');
const envLocation = path.resolve(__dirname, '..', '.env');
require('dotenv').config({ path: envLocation });
const {Command, flags} = require('@oclif/command')
const polygonScanApi = require('./utils/polygonscanApi');
const bscscanApi = require('./utils/bscscanApi');
const etherscanApi = require('./utils/etherscanApi');

const chains = {
  polygon: polygonScanApi,
  bsc: bscscanApi,
  eth: etherscanApi,
}

const chainsToRun = [
      'eth',
    'polygon',
  'bsc'
]

const headers = ['chain', 'address', 'addressLink', 'balance', 'lastTxDate'];

class AccountDetailCommand extends Command {
  static args = [
    { name: 'address'}
  ]

  async run() {
    const {args} = this.parse(AccountDetailCommand)
    const info = await this.getAccountInfo(args.address);
    this.log(this.formatCsv(info));
  }

  async getChainInfo(chain, address) {
    const api = chains[chain];
    if (!api) {
      this.error(`Chain ${chain} is not supported`);
    }
    const latestBlock = await api.getBlockNumber();
    const balance = await api.getBalance(address);
    const transactions = await api.getNormalTransactions(address, 0, latestBlock, 1, 1); // latest 1 transaction
    const internalTransactions = await api.getInternalTransactions(address, 0, latestBlock, 1, 1); // latest 1 transaction
    const lastTransactionTimestamp = transactions.length ? parseInt(transactions[0].timeStamp, 10) : undefined;
    const lastInternalTransactionTimestamp = internalTransactions.length ? parseInt(internalTransactions[0].timeStamp, 10) : undefined;
    const latestTimestamp = (lastTransactionTimestamp && lastInternalTransactionTimestamp) ? (lastTransactionTimestamp > lastInternalTransactionTimestamp ? lastTransactionTimestamp : lastInternalTransactionTimestamp) : lastTransactionTimestamp || lastInternalTransactionTimestamp;
    return {
      chain,
      address,
      latestBlock,
      link: api.getLink(address),
      balance,
      hasTransactions: (transactions.length + internalTransactions.length) > 0,
      daysSinceLastTransaction: latestTimestamp ? Math.ceil((Date.now() - (latestTimestamp * 1000))/(1000 * 60 * 60 * 24)) : 'n/a',
    }
  }

  async getAccountInfo(address) {
    const info = await Promise.all(chainsToRun.map(chain => this.getChainInfo(chain, address)))
    return info;
  }

  formatCsv(results) {
    const formatted = results.map(({ chain, address, link, balance, daysSinceLastTransaction }) => [
      chain,
      address,
      link,
      balance,
      daysSinceLastTransaction,
    ].join(',')).join('\n')
    return [headers, formatted].join('\n');
  }

}

AccountDetailCommand.description = 'Accepts a mnemonic and returns the list of addresses for given mnemonic'

AccountDetailCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  name: flags.string({char: 'n', description: 'Main command'}),
}

module.exports = AccountDetailCommand
