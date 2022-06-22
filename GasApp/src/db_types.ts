/**
 * An interface representing the data coming from the backend database
 * @date 22/06/2022 - 5:54:11 pm
 *
 * @interface DB_Result
 * @typedef {DB_Result}
 */
interface DB_Result {
    /**
     * True if data is available in the gasPrices field, false otherwise
     * @date 22/06/2022 - 5:54:11 pm
     *
     * @type {boolean}
     */
    dataAvailable: boolean;
    /**
     * Gas Prices 
     * @date 22/06/2022 - 5:54:11 pm
     *
     * @type {GasPrices}
     */
    gasPrices: GasPrices;
    /**
     * The block number these gas prices came from
     * @date 22/06/2022 - 5:54:11 pm
     *
     * @type {number}
     */
    blockNum: number;
}

/**
 * An interface containing all the gas prices
 * @date 22/06/2022 - 5:54:11 pm
 *
 * @interface GasPrices
 * @typedef {GasPrices}
 */
interface GasPrices {
    /**
     * The fast gas price
     * @date 22/06/2022 - 5:54:11 pm
     *
     * @type {number}
     */
    fast: number;
    /**
     * The average gas price
     * @date 22/06/2022 - 5:54:11 pm
     *
     * @type {number}
     */
    average: number;
    /**
     * The slow gas price
     * @date 22/06/2022 - 5:54:11 pm
     *
     * @type {number}
     */
    low: number;
}

export { DB_Result, GasPrices }