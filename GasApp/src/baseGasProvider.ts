import { DB_Result } from "./db_types"
import { GasProviderIntf } from "./gasProviderTypes"

/**
 * The base class for gas providers.
 * Implementing a new gas provider by extending from this class.
 * See how to do so by looking at the {@link EtherscanGasProvider} class.
 * @date 21/06/2022 - 4:54:02 pm
 *
 * @class BaseGasProvider
 * @typedef {BaseGasProvider}
 * @implements {GasProviderIntf}
 */
abstract class BaseGasProvider implements GasProviderIntf {
    /**
     * The value 200
     * @date 21/06/2022 - 4:54:02 pm
     *
     * @protected
     * @static
     * @type {number}
     */
    protected static HTTP_OK = 200
    /**
     * The string "OK"
     * @date 21/06/2022 - 4:54:02 pm
     *
     * @protected
     * @static
     * @type {string}
     */
    protected static S_OK = "OK" 

    /**
     * The url used by this provider
     * @date 21/06/2022 - 4:54:02 pm
     *
     * @type {string}
     */
    GAS_PROVIDER_URL: string
    /**
     * The base url for the gas provider
     * @date 21/06/2022 - 4:54:02 pm
     *
     * @type {string}
     */
    baseURL: string
    /**
     * The URL to use when getting the gas prices
     * @date 21/06/2022 - 4:54:02 pm
     *
     * @type {string}
     */
    gasProviderURL: string
    /**
     * The API to use for the provider
     * @date 21/06/2022 - 4:54:02 pm
     *
     * @type {string}
     */
    API_KEY: string

    /**
     * Creates an instance of BaseGasProvider, and sets the GAS_PROVIDER_URL to the given parameter
     * @date 21/06/2022 - 4:54:02 pm
     *
     * @constructor
     * @public
     * @param {string} defaultGasProviderURL
     */
    public constructor(defaultGasProviderURL: string) {
        this.GAS_PROVIDER_URL = defaultGasProviderURL
        this.baseURL = ""
        this.gasProviderURL = ""
        this.API_KEY = ""
    }

    /**
     * Returns true if the class is currently being tested
     * @date 21/06/2022 - 4:54:02 pm
     *
     * @protected
     * @returns {boolean} True if currently in testing
     */
    protected isTesting(): boolean {
        const result = (process.env['TESTING'] != undefined)
        return result
    }

    /**
     * @param  {string} url
     * Reserved for testing, should not be used normally
     */
    public setGasProviderURL(url: string) {
        this.baseURL = url;
        this.gasProviderURL = `${this.baseURL}${this.API_KEY}`
    }

    /**
     * Reserved for testing, should not be used normally
     * @date 21/06/2022 - 4:55:17 pm
     *
     * @public
     */
    public resetGasProviderURL() {
        this.setGasProviderURL(this.GAS_PROVIDER_URL)
    }
    
    /**
     * @param  {string} key
     */
    public setAPIKey(key: string) {
        this.API_KEY = key
    }

    /**
     * Provides the gas price as given by this provider
     * @date 21/06/2022 - 4:54:32 pm
     *
     * @public
     * @async
     * @returns {unknown}
     */
    public async getProviderGasPrice() {
        const result: DB_Result = {
            dataAvailable: false,
            gasPrices: {
                low: 0,
                average: 0,
                fast: 0
            },
            blockNum: 0
        }
        return result
    }
    
    /**
     * Gets the endpoint used by this class
     * @date 21/06/2022 - 4:55:17 pm
     *
     * @public
     * @returns {string}
     */
    public abstract getEndpoint(): string
    
    /**
     * Base/abstract method for providing a block number given a timestamp 
     * @date 21/06/2022 - 4:55:17 pm
     *
     * @public
     * @async
     * @param {number} timestamp
     * @returns {Promise<number>}
     */
    public abstract getBlockNumByTimestamp(timestamp: number): Promise<number>

    /**
     * Gets the class name
     * @date 22/06/2022 - 12:37:47 pm
     *
     * @public
     * @returns {string}
     */
    public getName(): string {
        return (<object>this).constructor.name;
    }
}

export {
    BaseGasProvider
}
