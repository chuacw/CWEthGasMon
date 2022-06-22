import express from "express";
import { Server } from "http";
import { BaseGasProvider } from "../src/baseGasProvider";
import { DB_Result } from "../src/db_types";
import { EthGasStationProvider, ETH_GAS_STATION_API_ENDPOINT } from "../src/ethGasStationProvider";
import { setDefaultGasProvider } from "../src/gasProviders";
import { EthGasStationQueryResult } from "../src/gasProviderTypes";
import { ServerResult, setError } from "../src/serverUtils";
import { MOCK_ETH_GAS_STATION_PORT } from "./gasProviderConsts";
import { enableTesting, disableTesting } from "./testUtils";

jest.setTimeout(1000000)

// this test can be run without using any containers
// test port, and test values, can be changed
const randomPort = MOCK_ETH_GAS_STATION_PORT; // this port must be different from the default port otherwise this test would fail
let mockSafeLow = 5;
let mockFast = 10;
let mockFastest = 15;
let mockBlockNum = 50;
// -------------------------------------------

function incMockPrices() {
    ++mockSafeLow
    ++mockFast
    ++mockFastest
    ++mockBlockNum
}

function defaultGasPrice(): EthGasStationQueryResult {
    const result: EthGasStationQueryResult = {
        // set the following values
        safeLow: mockSafeLow * 10,
        fast: mockFast * 10,
        fastest: mockFastest * 10,
        blockNum: mockBlockNum,

        // these values are ignored
        average: 0,
        block_time: 0,
        speed: 0,
        safeLowWait: 0,
        avgWait: 0,
        fastWait: 0,
        fastestWait: 0,
        gasPriceRange: {
            "4": 0,
            "6": 0,
            "8": 0,
            "10": 0,
            "20": 0,
            "30": 0,
            "40": 0,
            "50": 0,
            "60": 0,
            "70": 0,
            "80": 0,
            "90": 0,
            "100": 0,
            "110": 0,
            "120": 0,
            "130": 0,
            "140": 0,
            "150": 0,
            "160": 0,
            "170": 0,
            "180": 0,
            "190": 0,
            "210": 0,
            "230": 0,
            "250": 0,
            "270": 0,
            "290": 0,
            "300": 0,
            "310": 0,
            "330": 0,
            "350": 0,
            "360": 0,
            "370": 0,
            "390": 0
        }
    }
    return result
}

function adjustGasPrice(gasPrice: EthGasStationQueryResult): EthGasStationQueryResult {
    let result = JSON.parse(JSON.stringify(gasPrice)) // clone the source
    result.safeLow /= 10
    result.fast    /= 10
    result.fastest /= 10
    return result
}

const API_ENDPOINT = ETH_GAS_STATION_API_ENDPOINT;

function startGasStationMockServer(listenPort: number) {
    setDefaultGasProvider(EthGasStationProvider.name)

    const app = express()
    app.use(express.json())
    // return current gas prices at different tiers at the current block number
    app.get(`${API_ENDPOINT}`, (req: any, res: any) => {
        let response: ServerResult = { error: false, message: "" }
        try {
            const gasPriceNow = defaultGasPrice()
            response.message = JSON.stringify(gasPriceNow)
            res.send(gasPriceNow)
        } catch (e) {
            if ((typeof e == "object") && (e instanceof Error)) {
                setError(response, e.message)
            } else {
                setError(response, "Unknown error.")
            }
            res.send(response)
        }
    })
    const server = app.listen(listenPort, () => {
        console.log(`Mock Gas Station Provider listening on port ${listenPort}.`)
    })
    return server
}

function compareGasPrice(actualGasPrice: DB_Result, expectedGasPrice: EthGasStationQueryResult): boolean {
    const result = (
        (actualGasPrice.gasPrices.low == expectedGasPrice.safeLow) &&
        (actualGasPrice.gasPrices.average == expectedGasPrice.fast) &&
        (actualGasPrice.gasPrices.fast == expectedGasPrice.fastest) &&
        (actualGasPrice.blockNum == expectedGasPrice.blockNum)
    )
    return result
}

describe('test Gas Station Provider', () => {

    let server: Server
    let provider: BaseGasProvider
    beforeAll(()=>{
        setDefaultGasProvider(EthGasStationProvider.name)
        provider = new EthGasStationProvider()
        enableTesting()
        server = startGasStationMockServer(randomPort)
        provider.setGasProviderURL(`http://localhost:${randomPort}${API_ENDPOINT}`)
    })

    afterAll(()=>{
        disableTesting()
        if (server) server.close()
    })

    test("getGasPrice returns what was fetched 1", async () => {
        incMockPrices();
        const actualGasPrice1 = await provider.getProviderGasPrice() // this is the function being tested
        const expectedGasPrice1 = adjustGasPrice(defaultGasPrice())
        expect(compareGasPrice(actualGasPrice1, expectedGasPrice1)).toEqual(true)
    })

    test("getGasPrice returns what was fetched 2", async () => {
        incMockPrices();
        const actualGasPrice2 = await provider.getProviderGasPrice() // this is the function being tested
        const expectedGasPrice2 = adjustGasPrice(defaultGasPrice())
        expect(compareGasPrice(actualGasPrice2, expectedGasPrice2)).toEqual(true)
    })
});

