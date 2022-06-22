import axios from "axios";
import { BaseGasProvider } from "./baseGasProvider";
import { DB_Result } from "./db_types";
import { EtherscanGasResult } from "./gasProviderTypes";
import { log } from "./logProviders";

/**
 * The API endpoint for Etherscan
 * @date 21/06/2022 - 4:56:09 pm
 *
 * @type {"/api?"}
 */
const ETHERSCAN_API_ENDPOINT = "/api?"
/**
 * The URL to use for Etherscan
 * @date 21/06/2022 - 4:56:09 pm
 *
 * @type {string}
 */
const ETHERSCAN_GAS_PROVIDER_URL = `https://api.etherscan.io`
/**
 * The Etherscan gas provider
 * @date 21/06/2022 - 4:56:09 pm
 *
 * @class EtherscanGasProvider
 * @typedef {EtherscanGasProvider}
 * @extends {BaseGasProvider}
 */
class EtherscanGasProvider extends BaseGasProvider {

    /**
     * Creates an instance of EtherscanGasProvider.
     * @date 21/06/2022 - 4:56:09 pm
     *
     * @constructor
     */
    constructor() {
        super(ETHERSCAN_GAS_PROVIDER_URL)
        this.setGasProviderURL(ETHERSCAN_GAS_PROVIDER_URL)
        this.API_KEY = ""
    }

    // EthGasStation, fast -> fastest, average -> fast (don't get confused by
    // "average" field that's the average gas price between fastest, fast, and
    // safeLow), low -> safeLow
    /**
     * Gets the current gas price from/for Etherscan
     * @date 21/06/2022 - 4:56:09 pm
     *
     * @public
     * @async
     * @returns {unknown}
     */
    public async getProviderGasPrice() {
        const result: DB_Result = await super.getProviderGasPrice()
        const url = `${this.gasProviderURL}module=gastracker&action=gasoracle&apikey=${this.API_KEY}`
        const tempResult = await axios.get(url)
        if ((tempResult.status == BaseGasProvider.HTTP_OK) &&
            (tempResult.statusText == BaseGasProvider.S_OK)) {
            try {
                const tempData = tempResult.data as EtherscanGasResult
                result.gasPrices.low = Number.parseInt(tempData.result.SafeGasPrice)
                result.gasPrices.average = Number.parseInt(tempData.result.ProposeGasPrice)
                result.gasPrices.fast = Number.parseInt(tempData.result.FastGasPrice)
                result.blockNum = Number.parseInt(tempData.result.LastBlock)
                // possible to occur when API limit reached
                result.dataAvailable = (!isNaN(result.blockNum))
            } catch (e) {
                log(`Unable to parse gas price. URL: ${url}`)
            }
        }
        return result
    }

    /**
     * Gets the endpoint used by Etherscan
     * @date 21/06/2022 - 4:56:09 pm
     *
     * @public
     * @returns {string}
     */
    public getEndpoint(): string {
        return ETHERSCAN_API_ENDPOINT        
    }

    /**
     * Sets the URL to be used when calling Etherscan
     * @date 21/06/2022 - 4:56:09 pm
     *
     * @public
     * @param {string} url
     */
    public setGasProviderURL(url: string): void {
        this.baseURL = url
        this.gasProviderURL = `${this.baseURL}${ETHERSCAN_API_ENDPOINT}`
    }

    /**
     * Gets the block number given the timestamp
     * @date 21/06/2022 - 4:56:09 pm
     *
     * @public
     * @async
     * @param {number} timestamp The timestamp for the block number to get
     * @returns {Promise<number>}
     */
    public async getBlockNumByTimestamp(timestamp: number): Promise<number> {
        const closest = "before"
        const url = `${this.gasProviderURL}module=block&action=getblocknobytime&timestamp=${timestamp}&apikey=${this.API_KEY}&closest=${closest}`
        const tempResult = await axios.get(url)
        let result = Number.parseInt(tempResult.data.result)
        return result
    }
}

export {
    ETHERSCAN_API_ENDPOINT,
    EtherscanGasProvider
}
