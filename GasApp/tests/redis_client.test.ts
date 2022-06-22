import { connect, deleteKey, disconnect, getConnected, getExistKey, getValue, putValue } from "../src/redis_client"

// The redis container must be running for these tests to work
// redis closing/quitting issue during testing
// https://stackoverflow.com/questions/52939575/node-js-jest-redis-quit-but-open-handle-warning-persists/54560610#54560610
describe('testing db client', () => {

    afterEach(async()=>{
        await disconnect()
    })

    test("getConnected", ()=>{
        const getConnectedResult = getConnected()
        expect(getConnectedResult).toEqual(false)
    })

    test("disconnect", async () => {
        const disconnected = await disconnect()
        expect(disconnected).toEqual(true)
    })
    test("connect", async () => {
        const connected = await connect()
        expect(connected).toEqual(true)
    })

    let putKey = 5;
    let putLow = 10;
    let putAverage = 15;
    let putFast = 20;
    function resetPutKeyAndValues() {
        putKey = 5;
        putLow = 10;
        putAverage = 15;
        putFast = 20;
    }

    function incPutKeyAndValues() {
        ++putKey
        ++putLow
        ++putAverage
        ++putFast
    }

    describe('put/exist/get KV 1', () => {

        test("put should succeed", async () => {
            const putKV = await putValue(putKey, { low: putLow, average: putAverage, fast: putFast })
            expect(putKV).toEqual(true)
        })

        test("exist should succeed after put", async () => {
            const putKV = await putValue(putKey, { low: putLow, average: putAverage, fast: putFast })
            expect(putKV).toEqual(true)
            const existKV = await getExistKey(putKey)
            expect(existKV).toEqual(true)
        })

        test("get should succeed after put/exist succeeded", async () => {
            const getKV = await getValue(putKey)
            const dataAvail = getKV.dataAvailable
            const low = getKV.gasPrices.low
            const average = getKV.gasPrices.average
            const fast = getKV.gasPrices.fast
            expect(dataAvail).toEqual(true)
            expect(low).toEqual(putLow)
            expect(average).toEqual(putAverage)
            expect(fast).toEqual(putFast)
        })
    })

    describe('put/exist/get KV 2', () => {

        beforeAll(()=>{
            incPutKeyAndValues()
        })

        test("put should succeed", async () => {
            const putKV = await putValue(putKey, { low: putLow, average: putAverage, fast: putFast })
            expect(putKV).toEqual(true)
        })

        test("exist should succeed after put", async () => {
            const putKV = await putValue(putKey, { low: putLow, average: putAverage, fast: putFast })
            const existKV = await getExistKey(putKey)
            expect(existKV).toEqual(true)
        })

        test("get should succeed after put succeeded", async () => {
            const putKV = await putValue(putKey, { low: putLow, average: putAverage, fast: putFast })
            expect(putKV).toEqual(true)
            const getKV = await getValue(putKey)
            const dataAvail = getKV.dataAvailable
            const low = getKV.gasPrices.low
            const average = getKV.gasPrices.average
            const fast = getKV.gasPrices.fast
            expect(dataAvail).toEqual(true)
            expect(low).toEqual(putLow)
            expect(average).toEqual(putAverage)
            expect(fast).toEqual(putFast)
        })
    })

    describe('delete/exist', () => {
        test("delete should succeed", async () => {
            const keyDeleted = await deleteKey(5)
            expect(keyDeleted).toEqual(true)
        })
        test("getExist should return false", async () => {
            const keyExist = await getExistKey(5)
            expect(keyExist).toEqual(false)
        })
    })

});
