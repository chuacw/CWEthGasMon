import { ServerResult, startListening, stopListening } from "../src/server";
import express from 'express';
import axios from "axios";
import { Server } from "http";
import { getDefaultGasProvider, setDefaultGasProvider } from "../src/gasProviders";
import { EtherscanGasProvider } from "../src/etherscanGasProvider";
import { setError } from "../src/serverUtils";

jest.setTimeout(10000)

function startTimestampServer(listenPort: number) {
    
    const app = express()
    app.use(express.json())
    const provider = getDefaultGasProvider()
    const endpoint = provider.getEndpoint()
    app.get(`${endpoint}`, (req: any, res: any) => {
        let response: ServerResult = { error: false, message: "" }
        try {
        } catch (e) {
            if ((typeof e == "object") && (e instanceof Error)) {
                setError(response, e.message)
            } else {
                setError(response, "Unknown error.")
            }
        }
        res.json(response)
    })
    const server = app.listen(listenPort, () => {
        console.log(`Mock Timestamp server listening on port ${listenPort}.`)
    })
    return server
}

// can be tested without containers running
describe('testing server', () => {
    const randomPort = 3500; // this port must be different from the default port otherwise this test would fail
    let server: Server | undefined;
    let timestampServer: Server;
    beforeAll(async ()=> {
        setDefaultGasProvider(EtherscanGasProvider.name)
        const provider = getDefaultGasProvider()
        // enableTesting()
        // const timestampServerPort = randomPort + 1
        // provider.setGasProviderURL(`http://localhost:${timestampServerPort}`)
        // timestampServer = startTimestampServer(timestampServerPort)
        server = await startListening(randomPort)
    })
    afterAll(async ()=> {
        stopListening()
        // timestampServer.close()
    })

    describe('testing Average endpoint', () => {
        const BaseURL = `http://localhost:${randomPort}/average`
        test("missing fromTime and toTime", async() => {
            const response = await axios.get(`${BaseURL}`)
            expect(response.data.error).toEqual(true)
        })

        test("missing toTime should fail", async () => {
            const url = `${BaseURL}?fromTime=1`
            const response = await axios.get(url)
            expect(response.data.error).toEqual(true)
        })

        test("missing fromTime should fail", async () => {
            const url = `${BaseURL}?toTime=1`
            const response = await axios.get(url)
            expect(response.data.error).toEqual(true)
        })

        test("invalid fromTime & toTime should fail", async () => {
            const fromTime = 1
            const toTime = 1
            const url = `${BaseURL}?fromTime=${fromTime}&toTime=${toTime}`
            const response = await axios.get(url)
            expect(response.data.error).toEqual(true)
            const expectedErrorMessage = `Cannot convert fromTime(${fromTime}) or toTime(${toTime}) to a valid timestamp.`
            expect(response.data.message).toEqual(expectedErrorMessage)
        })
    })

});
