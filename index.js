const Web3 = require('web3')
const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default
const ProviderEngine = require('web3-provider-engine')
const ProviderSubprovider = require('web3-provider-engine/subproviders/provider.js')
const FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js')
const createLedgerSubprovider = require('@ledgerhq/web3-subprovider').default

let engine;
const getEngine = (options, url) => {
  if (engine) {
    return engine;
  }
  engine = new ProviderEngine();
  const ledgerSubprovider = createLedgerSubprovider(() => {
    return TransportNodeHid.create();
  }, options);
  engine.addProvider(ledgerSubprovider);
  engine.addProvider(new FiltersSubprovider());
  engine.addProvider(new ProviderSubprovider(new Web3.providers.HttpProvider(url)));
  engine.start();
  return engine;
}

class LedgerProvider {
  constructor(options, url) {
    this.engine = getEngine(options, url);
  }

  sendAsync() {
    return this.engine.sendAsync.apply(this.engine, arguments);
  }

  send() {
    return this.engine.send.apply(this.engine, arguments);
  }
}

module.exports = LedgerProvider
