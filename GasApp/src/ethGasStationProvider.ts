import axios from "axios";
import { BaseGasProvider } from "./baseGasProvider";
import { DB_Result } from "./db_types";
import { EthGasStationQueryResult, GasProviderIntf } from "./gasProviderTypes";

/**
 * The API endpoint for EthGasStation
 * @date 21/06/2022 - 4:58:57 pm
 *
 * @type {"/api/ethgasAPI.json"}
 */
const ETH_GAS_STATION_API_ENDPOINT = "/api/ethgasAPI.json"
/**
 * The full URL used by getting the gas prices
 * @date 21/06/2022 - 4:58:57 pm
 *
 * @type {string}
 */
const ETH_GAS_STATION_PROVIDER_URL = `https://ethgasstation.info${ETH_GAS_STATION_API_ENDPOINT}`
/**
 * Encapsulates the gas prices as provided by EthGasStation
 * @date 21/06/2022 - 4:58:57 pm
 *
 * @class EthGasStationProvider
 * @typedef {EthGasStationProvider}
 * @extends {BaseGasProvider}
 */
class EthGasStationProvider extends BaseGasProvider {
    /**
     * Creates an instance of EthGasStationProvider.
     * @date 21/06/2022 - 4:58:57 pm
     *
     * @constructor
     */
    constructor() {
        super(ETH_GAS_STATION_PROVIDER_URL)
        this.setGasProviderURL(this.GAS_PROVIDER_URL)
        this.API_KEY = ""
    }

    /**
     * This class does not implement this method, so throw an error!
     * @date 22/06/2022 - 1:00:29 pm
     *
     * @public
     * @param {number} timestamp
     * @returns {Promise<number>}
     */
    public async getBlockNumByTimestamp(timestamp: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

    // EthGasStation, fast -> fastest, average -> fast (don't get confused by
    // "average" field that's the average gas price between fastest, fast, and
    // safeLow), low -> safeLow

    /**
     * The endpoint as used by EthGasStation
     * @date 21/06/2022 - 4:58:57 pm
     *
     * @public
     * @returns {string}
     */
    public getEndpoint(): string {
        return ETH_GAS_STATION_API_ENDPOINT        
    }

    /**
     * Provides the gas price as provided by ethGasStation
     * Can throw an exception if unable to fetch the gas price
     * @date 21/06/2022 - 4:58:57 pm
     *
     * @async
     * @returns {Promise<DB_Result>}
     */
    async getProviderGasPrice(): Promise<DB_Result> {
        const result: DB_Result = await super.getProviderGasPrice()
        const tempResult = await axios.get(this.gasProviderURL)
        if ((tempResult.status == BaseGasProvider.HTTP_OK) &&
            (tempResult.statusText == BaseGasProvider.S_OK)) {
            const tempData = tempResult.data as EthGasStationQueryResult
            // Results are x10, so need to /10, see https://docs.ethgasstation.info/gas-price#gas-price
            result.gasPrices.low = Math.round(tempData.safeLow / 10) // round up
            result.gasPrices.average = Math.floor(tempData.fast / 10) // round down
            result.gasPrices.fast = Math.round(tempData.fastest / 10) // round up
            result.blockNum = tempData.blockNum
            result.dataAvailable = (!isNaN(result.blockNum))
        }
        return result
    }
}

export {
    ETH_GAS_STATION_API_ENDPOINT,
    EthGasStationProvider
}
