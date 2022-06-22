import { getDefaultGasProvider, setDefaultGasProvider } from "./gasProviders"
import { getDefaultLogProvider, log, setDefaultLogProvider } from "./logProviders"
import { startGathering, startListening } from "./server"
import path from 'path'
import fs from 'fs'
import { ConsoleLogProvider } from "./consoleLogProvider"
import { setRedisURL } from "./redis_client"

/**
 * Finds the configuration file and load it
 * Looks in these directories in order of precedence: ./, ../, ./conf, ../conf
 * @date 21/06/2022 - 4:56:49 pm
 */
function loadConfig() {
  const env = ".env"
  const paths = ["./", "../", "./conf", "../conf"]
  for (let lpath of paths) {
    const envPath = path.resolve(lpath, env)
    if (fs.existsSync(envPath)) {
        require("dotenv").config({path: envPath})
        break
    }
  }
}

loadConfig()

/**
 * The default port the server listens on. If not specified, listens on 3000
 * @date 21/06/2022 - 4:56:49 pm
 *
 * @type {*}
 */
const G_LISTEN_PORT = Number.parseInt(process.env.LISTEN_PORT || "3000")
/**
 * The API key to use for the provider specified in GAS_PROVIDER
 * @date 21/06/2022 - 4:56:49 pm
 *
 * @type {*}
 */
const G_API_KEY = process.env.API_KEY
/**
 * The time in milliseconds to scan for gas prices, default of 5000 ms.
 * @date 21/06/2022 - 4:56:49 pm
 *
 * @type {*}
 */
const G_EVM_MSPerBlock = Number.parseInt(process.env.SCAN_TIME || "5000") // number of milliseconds per block
/**
 * The default gas provider to use
 * @date 21/06/2022 - 4:56:49 pm
 *
 * @type {*}
 */
const G_GAS_PROVIDER = process.env.GAS_PROVIDER
/**
 * The default log provider to use, if not specified, logs to the console
 * @date 22/06/2022 - 2:16:16 pm
 *
 * @type {*}
 */
const G_LOG_PROVIDER = process.env.LOG_PROVIDER || ConsoleLogProvider.name
/**
 * The redis url to use
 * @date 22/06/2022 - 5:53:52 pm
 *
 * @type {*}
 */
const G_REDIS_URL = process.env.REDIS_URL
/**
 * The main entry point for starting the server
 * @date 21/06/2022 - 4:56:49 pm
 */
async function main() {
    if (!G_API_KEY) {
        log("API_KEY not defined!")
        return
    }

    if (!G_GAS_PROVIDER) {
        log("GAS_PROVIDER is not defined!")
        return
    }

    if (G_LOG_PROVIDER) {
      setDefaultLogProvider(G_LOG_PROVIDER)
    }

    if (!G_REDIS_URL) {
      log("REDIS_URL is not defined!")
      return
    }

    setDefaultGasProvider(G_GAS_PROVIDER)
    const provider = getDefaultGasProvider(); 
    provider.setAPIKey(G_API_KEY)

    await setRedisURL(G_REDIS_URL)

    startGathering(G_EVM_MSPerBlock)
    startListening(G_LISTEN_PORT)
}

main()