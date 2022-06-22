import { BaseGasProvider } from "./baseGasProvider"
import { EtherscanGasProvider } from "./etherscanGasProvider"
import { EthGasStationProvider } from "./ethGasStationProvider"

/**
 * The default provider to use
 * @date 21/06/2022 - 4:56:21 pm
 *
 * @type {string}
 */
let G_PROVIDER_NAME: string | undefined
/**
 * Sets the default gas provider to be used
 * @date 21/06/2022 - 4:56:21 pm
 *
 * @param {string} name
 */
function setDefaultGasProvider(name: string) {
  G_PROVIDER_NAME = name
}
/**
 * An instance of the default provider
 * @date 21/06/2022 - 4:56:21 pm
 *
 * @type {BaseGasProvider}
 */
let DEFAULT_PROVIDER: BaseGasProvider
/**
 * Gets an instance of the default provider
 * @date 21/06/2022 - 4:56:21 pm
 *
 * @returns {BaseGasProvider}
 */
function getDefaultGasProvider(): BaseGasProvider {
  let result: BaseGasProvider;
  if (!DEFAULT_PROVIDER) {
    // class of BaseGasProvider
    // to support additional gas providers, add them after EtherscanGasProvider
    const AvailableProviders: { new(): BaseGasProvider }[] = [EtherscanGasProvider]
    const useProvider = G_PROVIDER_NAME
    if (!useProvider) {
      throw new Error("GAS_PROVIDER not defined!")
    }
    // return an instance of a class that matches the name given in the env file
    for (let provider of AvailableProviders) {
      if (useProvider!.toUpperCase() == provider.name.toUpperCase()) {
        DEFAULT_PROVIDER = new provider()
        break
      }
    }
  }
  if (!DEFAULT_PROVIDER) {
     throw new Error("Default provider cannot be found!")
  }
  result = DEFAULT_PROVIDER
  return result
}

function resetDefaultGasProvider() {
  G_PROVIDER_NAME = undefined
}

export {
  setDefaultGasProvider,
  getDefaultGasProvider,
  resetDefaultGasProvider
}