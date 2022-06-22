import { createClient } from 'redis';
import { BigNumberish, BigNumber } from "ethers";
import { DB_Result, GasPrices } from './db_types';
import { log } from './logProviders';


/**
 * An instance of the redis client
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @type {*}
 */
let GClient = createClient();
/**
 * Whether the redis client is connected
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @type {boolean}
 */
let GConnected: boolean = false;
/**
 * Returns an instance of the global redis client
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @returns {*}
 */
function createDbClient() {
    return GClient;
}

/**
 * Ensures the redis client is connected
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @async
 * @returns {Promise<boolean>}
 */
async function connect(): Promise<boolean> {
    let result: boolean = false
    try {
        if (!GClient) {
            createDbClient()
        }
        GClient.on('error', (err: any) => {
            log("Redis Client error", err)
        });
        
        const tempConnected = await GClient.connect()
        result = true
        GConnected = true
    } catch (e) {
        if (typeof e == "object") {
            if ((e as Error).message.startsWith("connect ECONNREFUSED")) {
                result = false
                GConnected = false
            } else
                if ((e as Error).message == "Socket already opened") {
                    result = true
                    GConnected = true
                }
        }
    }
    return result
}

/**
 * Deletes away the value for the given key
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @async
 * @param {BigNumberish} key_blockNum
 * @returns {Promise<boolean>}
 */
async function deleteKey(key_blockNum: BigNumberish): Promise<boolean> {
    if (!GConnected) {
        await connect()
    }
    const key = BigNumber.from(key_blockNum).toString()
    let result: boolean = false
    try {
        const rowsDeleted = await GClient.del(key) // returns rows deleted
        result = (rowsDeleted >= 0)
    } catch (e) {
        log("deleteKey exception", e)
        GConnected = false // assume connection error
    }
    return result
}

/**
 * Disconnects the redis client
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @async
 * @returns {Promise<boolean>}
 */
async function disconnect(): Promise<boolean> {
    let result: boolean = false
    try {
        await GClient.quit()
        result = true
        GConnected = false
    } catch (e) {
        if ((typeof e == "object") && ((e as any).constructor.name == "ClientClosedError")) {
            result = true
            GConnected = false
        } else {
            log("disconnect exception", e)
        }
    }
    return result
}

/**
 * Gets the redis connected flag
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @returns {boolean}
 */
function getConnected(): boolean {
    return GConnected
}

/**
 * Checks if values for the given key exists, with automatic connection
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @async
 * @param {BigNumberish} blockNum - the key to check for its value.
 * @returns {Promise<boolean>} true if value exists, otherwise false.
 */
async function getExistKey(blockNum: BigNumberish): Promise<boolean> {
    let result: boolean = false
    try {
        if (!GConnected) {
            await connect()
        }
        const key = blockNum.toString()
        const value = await GClient.get(key)
        result = (value != null)
    } catch (e) {
        log("getExistKey exception", e)
        GConnected = false // assume connection error
        result = false
    }
    return result;
}

/**
 * Gets the value for the given key
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @async
 * @param {BigNumberish} blockNum The key to retrieve values for
 * @returns {Promise<DB_Result>} The values retrieved for the key
 */
async function getValue(blockNum: BigNumberish): Promise<DB_Result> {
    const result: DB_Result = { 
        dataAvailable: false, 
        gasPrices: { low: 0, average: 0, fast: 0 }, 
        blockNum: 0
    }
    try {
        if (!GConnected) {
            await connect()
        }
        const key = blockNum.toString()
        const value = await GClient.get(key)
        result.dataAvailable = (value != null)
        if (result.dataAvailable) {
            const data = value!.split(" ")
            result.gasPrices.low = Number.parseInt(data[0])
            result.gasPrices.average = Number.parseInt(data[1])
            result.gasPrices.fast = Number.parseInt(data[2])
            result.blockNum = BigNumber.from(blockNum).toNumber()
        }
    } catch (e) {
        // e.constructor.name == 'SocketClosedUnexpectedlyError', e.message = 'Socket closed unexpectedly'
        log("getValue exception", e)
        GConnected = false // assume connection error
        result.dataAvailable = false
    }
    return result;
}

/**
 * Stores the gas prices for the given key
 * @date 21/06/2022 - 4:57:05 pm
 *
 * @async
 * @param {BigNumberish} key_blockNum - the key to store the gas prices.
 * @param {GasPrices} gasPrices - the gas prices to store.
 * @returns {Promise<boolean>} returns true if the value is stored successfully, otherwise false.
 */
async function putValue(key_blockNum: BigNumberish, gasPrices: GasPrices): Promise<boolean> {
    const key = key_blockNum.toString()
    const value = `${gasPrices.low} ${gasPrices.average} ${gasPrices.fast}`
    let result: boolean = false
    try {
        if (!GConnected) {
            await connect()
        }
        const setResult = await GClient.set(key, value)
        result = (setResult == "OK")
    } catch (e) {
        log("putValue exception", e)
        GConnected = false // assume connection error
    }
    return result
}

/**
 * Sets the URL to be used for the redis client
 * Do not use if the client has already started usage
 * @date 22/06/2022 - 5:45:35 pm
 *
 * @param {string} redis_url
 */
async function setRedisURL(redis_url: string) {
    if (GClient) {
        try {
            await disconnect()
        } catch(e) {
            log("Exception when trying to disconnect", e)
        }
    }
    GClient = createClient({url: redis_url})
}

export {
    createDbClient,
    connect,
    deleteKey,
    disconnect,
    getConnected,
    getExistKey,
    getValue,
    putValue,
    setRedisURL
}