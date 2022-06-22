import express from "express";
import { Server } from "http";
import { BaseGasProvider } from "../src/baseGasProvider";

import { DB_Result } from "../src/db_types";
import { EtherscanGasProvider, ETHERSCAN_API_ENDPOINT } from "../src/etherscanGasProvider";
import { getDefaultGasProvider, setDefaultGasProvider } from "../src/gasProviders";
import { EtherscanGasInfo, EtherscanGasResult } from "../src/gasProviderTypes";
import { ServerResult } from "../src/server";
import { setError } from "../src/serverUtils";
import { MOCK_ETHERSCAN_PORT } from "./gasProviderConsts";
import { disableTesting, enableTesting } from "./testUtils"

jest.setTimeout(1000000)

// this test can be run without using any containers
// test port, and test values, can be changed
const randomPort = MOCK_ETHERSCAN_PORT; // this port must be different from the default port otherwise this test would fail
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

function defaultGasPrice(): EtherscanGasResult {
    const result: EtherscanGasResult = {
        // set the following values
        status: "OK",
        message: "",
        result: {
            SafeGasPrice: `${mockSafeLow}`, // low
            ProposeGasPrice: `${mockFast}`, // average
            FastGasPrice: `${mockFastest}`, // fast
            LastBlock: `${mockBlockNum}`,

            // ignored
            suggestBaseFee: "",
            gasUsedRatio: ""
        }
    }
    return result
}

const API_ENDPOINT = ETHERSCAN_API_ENDPOINT;

function startEtherscanMockServer(listenPort: number) {
    
    const app = express()
    app.use(express.json())
    // return current gas prices at different tiers at the current block number
    app.get(`${API_ENDPOINT}`, (req: any, res: any) => {
        let response: ServerResult = { error: false, message: "" }
        try {
            const gasPriceNow = defaultGasPrice()
            res.send({result: gasPriceNow.result})
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
        console.log(`Mock Etherscan Provider listening on port ${listenPort}.`)
    })
    return server
}

function compareGasPrice(actualGasPrice: DB_Result, expectedGasPrice: EtherscanGasInfo): boolean {
    const low      = Number.parseInt(expectedGasPrice.SafeGasPrice)
    const average  = Number.parseInt(expectedGasPrice.ProposeGasPrice)
    const fast     = Number.parseInt(expectedGasPrice.FastGasPrice)
    const blockNum = Number.parseInt(expectedGasPrice.LastBlock)
    const result = (
        (actualGasPrice.gasPrices.low == low) &&
        (actualGasPrice.gasPrices.average == average) &&
        (actualGasPrice.gasPrices.fast == fast) &&
        (actualGasPrice.blockNum == blockNum)
    )
    return result
}

describe('test Etherscan Provider', () => {

    let server: Server
    let provider: BaseGasProvider
    beforeAll(()=>{
        setDefaultGasProvider(EtherscanGasProvider.name)
        provider = getDefaultGasProvider()
        enableTesting()
        server = startEtherscanMockServer(randomPort)
        provider.setGasProviderURL(`http://localhost:${randomPort}`)
    })

    afterAll(()=>{
        disableTesting()
        if (server) server.close()
    })

    test("getGasPrice returns what was fetched 1", async () => {
            incMockPrices();
            const actualGasPrice1 = await provider.getProviderGasPrice() // this is the function being tested
            const expectedGasPrice1 = defaultGasPrice()
            expect(compareGasPrice(actualGasPrice1, expectedGasPrice1.result)).toEqual(true)
    })

    test("getGasPrice returns what was fetched 2", async () => {
            const actualGasPrice2 = await provider.getProviderGasPrice() // this is the function being tested
            const expectedGasPrice2 = defaultGasPrice()
            expect(compareGasPrice(actualGasPrice2, expectedGasPrice2.result)).toEqual(true)
    })
});

