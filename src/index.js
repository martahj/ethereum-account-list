/* eslint-disable camelcase */
/* eslint-disable no-console */
const path = require('path');
const envLocation = path.resolve(__dirname, '..', '.env');
require('dotenv').config({ path: envLocation });
const {Command, flags} = require('@oclif/command')
const { getEth, getNormalTransactions, getBlockNumber, getInternalTransactions, getEtherscanAddress} = require('./utils/etherscanApi');


class AccountDetailCommand extends Command {
  static args = [
    { name: 'address'}
  ]

  async run() {
    const {args} = this.parse(AccountDetailCommand)
    this.getAccountInfo(args.address);
  }

  async getAccountInfo(address) {
    const block = await getBlockNumber();
    const ethBalance = await getEth(address);
    const transactions = await getNormalTransactions(address, 0, block, 1, 1);
    const internalTransactions = await getInternalTransactions(address, 0, block, 1, 1);
    const result = [
      address,
      ethBalance > 0,
      (transactions.length + internalTransactions.length) > 0,
      getEtherscanAddress(address)
    ].join(',')
    this.log(result)
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
