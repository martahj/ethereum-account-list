/* eslint-disable camelcase */
/* eslint-disable no-console */
const {Command, flags} = require('@oclif/command')
const {CliUx} = require('@oclif/core')
const {cli} = require('cli-ux')
const ethers = require('ethers')

const getDerivationPath = index => {
  const baseDerivationPath = "m/44'/60'/0'/0/"
  return `${baseDerivationPath}${index}`
}

class AccountListCommand extends Command {
  static args = [
    {name: 'mnemonic'},
  ]

  async run() {
    // const mnemonic = await cli.prompt('Please provide a mnemonic')
    const {args} = this.parse(AccountListCommand)
    const hdNode = ethers.utils.HDNode.fromMnemonic(args.mnemonic)
    const accountList = []
    for (let i = 0; i < 10; i++) {
      const derivationPath = getDerivationPath(i)
      const account = hdNode.derivePath(derivationPath)
      const formattedData = {
        index: i,
        address: account.address,
      }
      accountList.push(formattedData)
    }
    const columns = {
      index: {},
      address: {},
    }
    CliUx.ux.table(accountList, columns, {})
  }
}

AccountListCommand.description = 'Accepts a mnemonic and returns the list of addresses for given mnemonic'

AccountListCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  name: flags.string({char: 'n', description: 'Main command'}),
}

module.exports = AccountListCommand
