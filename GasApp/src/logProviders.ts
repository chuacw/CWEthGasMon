import { BaseLogProvider } from "./baseLogProvider";
import { ConsoleLogProvider } from "./consoleLogProvider";

/**
 * Stores the class name of the default log provider to be used
 * @date 22/06/2022 - 1:47:18 pm
 *
 * @type {(string | undefined)}
 */
let G_LOG_PROVIDER_NAME: string | undefined
/**
 * An instance of the log provider
 * @date 22/06/2022 - 1:47:18 pm
 *
 * @type {BaseLogProvider}
 */
let DEFAULT_LOG_PROVIDER: BaseLogProvider

/**
 * Returns an instance of the default log provider
 * Throws an exception if none is found
 * @date 22/06/2022 - 1:47:18 pm
 *
 * @returns {BaseLogProvider}
 */
function getDefaultLogProvider(): BaseLogProvider {
    let result: BaseLogProvider;
    if (!DEFAULT_LOG_PROVIDER) {
      // class of BaseLogProvider
      // to support additional log providers, add the class name after ConsoleLogProvider
      const AvailableProviders: { new(): BaseLogProvider }[] = [ConsoleLogProvider]
      const useProvider = G_LOG_PROVIDER_NAME
      if (!useProvider) {
        throw new Error("LOG_PROVIDER not defined!")
      }
      // return an instance of a class that matches the name given in the env file
      for (let provider of AvailableProviders) {
        if (useProvider!.toUpperCase() == provider.name.toUpperCase()) {
          DEFAULT_LOG_PROVIDER = new provider()
          break
        }
      }
    }
    if (!DEFAULT_LOG_PROVIDER) {
       throw new Error("Default log provider cannot be found!")
    }
    result = DEFAULT_LOG_PROVIDER
    return result
}
/**
 * Sets the default log provider to be used
 * @date 22/06/2022 - 1:47:18 pm
 *
 * @param {string} name
 */
function setDefaultLogProvider(name: string) {
    G_LOG_PROVIDER_NAME = name
}
  
/**
 * Sends the message to the default log provider
 * if the default log provider is absent, sends the messages to the consoles
 * @date 22/06/2022 - 1:47:18 pm
 *
 * @param {string} message
 * @param {?*} [err]
 */
function log(message: string, err?: any): void {
    const dateNow = new Date().toISOString()
    const msg = `${message}${(err)?' '+(err):""}`
    const timestampMsg = `${dateNow} ${msg}`
    let logInstance: BaseLogProvider | undefined
    try {
      logInstance = getDefaultLogProvider() 
    } catch(e) {
      // no need to panic, there's a default  
    }
    if (logInstance) {
        logInstance.log(timestampMsg)
    } else {
        console.log(timestampMsg)
    }
}

export {
    getDefaultLogProvider,
    log,
    setDefaultLogProvider
}