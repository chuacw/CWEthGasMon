import express from 'express'
import { Server } from 'http'
import { DB_Result, GasPrices } from './db_types'
import { getDefaultGasProvider } from './gasProviders';
import { log } from './logProviders';
import { getExistKey, getValue, putValue } from './redis_client'
import { checkUndefined, ServerResult, setError } from './serverUtils';
import { DateToTimestamp } from './timeUtils';

/**
 * The last saved block number for the gas
 * @date 21/06/2022 - 4:57:16 pm
 *
 * @type {number}
 */
let GLastSavedBlock: number = 0
/**
 * Saves the given gas price into storage
 * @date 21/06/2022 - 4:57:16 pm
 *
 * @async
 * @param {DB_Result} value
 * @returns {*}
 */
async function saveGasPriceIntoStorage(value: DB_Result) {
    if (!(value.dataAvailable)) {
        return
    }
    try {
        if (GLastSavedBlock == value.blockNum) {
            log(`Already saved gas prices for ${value.blockNum}.`)
            return
        }
        const putResult = await putValue(value.blockNum, value.gasPrices)
        if (putResult) {
            GLastSavedBlock = value.blockNum
            log(`Saved gas prices for ${value.blockNum}.`)
        }
    } catch (e) {
        log("unable to persist gas price")
    }
}
/**
 * @returns Promise
 */
async function getGasPriceNow(): Promise<GasPrices> {
    let result: GasPrices = { low: 0, average: 0, fast: 0 }
    const provider = getDefaultGasProvider()
    const value = await provider.getProviderGasPrice()
    await saveGasPriceIntoStorage(value)
    result = value.gasPrices
    return result
}
/**
 * @param  {number} blockNum
 * @returns Promise
 */
async function getGasPrice(blockNum: number): Promise<GasPrices> {
    let result: GasPrices = { low: 0, average: 0, fast: 0 }
    const value = await getValue(blockNum);
    if (value.dataAvailable) {
        result = value.gasPrices
    } else {
        const message = `gas price unavailable for block number: ${blockNum}!`
        throw new Error(message)
    }
    return result
}
/**
 * @param  {number} listenPort
 */
async function startListening(listenPort: number) {

    if (GServer) {
        return GServer
    }

    const app = express()
    app.use(express.json())
    // return current gas prices at different tiers at the current block number
    app.get('/gas', async (req: any, res: any) => {
        let response: ServerResult = { error: false, message: "" }
        try {
            const gasPriceNow = await getGasPriceNow()
            response.message = JSON.stringify(gasPriceNow)
        } catch (e) {
            if ((typeof e == "object") && (e instanceof Error)) {
                setError(response, e.message)
            } else {
                setError(response, "Unknown error.")
            }
        }
        res.json(response)
    })

    // Returns the average gas price between a specified time interval
    app.get('/average', async (req: any, res: any) => {
        const sFromTime = req.query.fromTime
        const sToTime = req.query.toTime
        let response: ServerResult = { error: false, message: "" }
        if ((checkUndefined(sFromTime, "fromTime", response) || checkUndefined(sToTime, "toTime", response))) {
            res.json(response)
            return
        }

        const fromTime = Number.parseInt(sFromTime)
        const toTime = Number.parseInt(sToTime)
        if (isNaN(fromTime) || isNaN(toTime)) {
            setError(response, `fromTime (${sFromTime}) or toTime (${sToTime}) contains invalid number!`)
            res.json(response)
            return
        }

        if (fromTime > toTime) {
            setError(response, `fromTime(${fromTime}) is > toTime(${toTime})!`)
            res.json(response)
            return
        }

        let currentTimestamp = DateToTimestamp(new Date())
        if (toTime > currentTimestamp) {
            setError(response, `toTime(${toTime}) is set in the future!`)
            res.json(response)
            return
        }

        let provider = getDefaultGasProvider()
        const fromBlock = await provider.getBlockNumByTimestamp(fromTime)
        const toBlock = await provider.getBlockNumByTimestamp(toTime)
        try {
            if (isNaN(fromBlock) || isNaN(toBlock)) {
                throw new Error(`Cannot convert fromTime(${fromTime}) or toTime(${toTime}) to a valid timestamp.`)
            }
            const count = (toBlock - fromBlock) + 1
            const gasPricesArray: GasPrices[] = new Array(count)
            const avgValues: GasPrices = { low: 0, average: 0, fast: 0 }
            let errorCount = 0; let blocksFetched = 0; let index = 0;
            let successfulBlocks = []; let failedBlocks = [];
            for (let blockNum = fromBlock; blockNum <= toBlock; blockNum++) {
                try {
                    const value = await getGasPrice(blockNum);
                    successfulBlocks.push(blockNum)
                    ++blocksFetched
                    gasPricesArray[index] = value
                    index++
                    avgValues.low += value.low
                    avgValues.average += value.average
                    avgValues.fast += value.fast
                } catch(e) {
                    failedBlocks.push(blockNum)
                    ++errorCount;
                }          
            }
            avgValues.low = Math.floor(avgValues.low / blocksFetched)
            avgValues.average = Math.floor(avgValues.average / blocksFetched)
            avgValues.fast = Math.floor(avgValues.fast / blocksFetched)
            const gasPrice = { averageGasPrice: avgValues.average, fromTime: fromTime, toTime: toTime,
                fetchedBlocks: successfulBlocks,
                missingBlocks: failedBlocks
            }
            response.message = JSON.stringify(gasPrice)
            res.json(response)
        } catch (e) {
            response.error = true
            if (typeof e == "object") {
                response.message = (e as any).message
            } else {
                response.message = JSON.stringify(e)
            }
            res.json(response)
        }
    })

    GServer = app.listen(listenPort, () => {
        log(`Eth gas listening on port ${listenPort}.`);
    })

    return GServer;
}

/**
 * Stores an instance of the server
 * @date 21/06/2022 - 4:57:16 pm
 *
 * @type {(Server | undefined)}
 */
let GServer: Server | undefined;

/**
 * Tells the server to stop listening.
 * @date 22/06/2022 - 2:57:54 pm
 */
function stopListening() {
    if (GServer) {
        GServer.close()
    }
    GServer = undefined
}

/**
 * Fetches the current gas price, and logs an exception if it fails
 * @date 22/06/2022 - 2:58:17 pm
 *
 * @async
 * @returns {*}
 */
async function fetchGasPrice() {
    try {
        const gasPriceNow = await getGasPriceNow()
    } catch (e) {
        log("Failed to gather gas price.", e)
    }
}

/**
 * Timer for retrieving gas prices
 * @date 21/06/2022 - 4:57:16 pm
 *
 * @type {ReturnType<typeof setInterval>}
 */
let GTimer: ReturnType<typeof setInterval>

/**
 * Starts gathering gas prices at every given interval
 * @date 22/06/2022 - 2:59:38 pm
 *
 * @param {number} interval The interval to retrieve gas prices, given in ms.
 */
function startGathering(interval: number) {
    setImmediate(async () => {
        await fetchGasPrice()
    })
    GTimer = setInterval(async () => {
        await fetchGasPrice()
    }, interval)
    log("Started gathering gas prices.")
}


/**
 * Stops the timer to gather gas prices
 * @date 22/06/2022 - 3:00:20 pm
 */
function stopGathering() {
    clearInterval(GTimer)
    log("Stopped gathering gas prices.")
}

export { startListening, stopListening, startGathering, stopGathering, ServerResult }