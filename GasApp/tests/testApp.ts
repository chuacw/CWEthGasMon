import axios from "axios";
import { getDefaultGasProvider } from "../src/GasProviders";
import { log } from "../src/logProvider";
import { startGathering, startListening, stopGathering, stopListening } from "../src/server";
import { DateToTimestamp } from "../src/timeUtils";

function UTCToTimestamp(time: string) {
    let date = new Date(time)
    let result = date.getTime() / 1000
    return result; 
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// 14997467
// 14997480

async function test1() {
    const fromInterval = UTCToTimestamp("Jun-20-2022 04:07:29 PM +0000")
    const toInterval = UTCToTimestamp("Jun-20-2022 04:15:29 PM +0000")
    console.log('from Interval: ', fromInterval)
    console.log('to Interval: ', toInterval)

    let provider = getDefaultGasProvider()
    provider.setAPIKey("3VD5A4RPGYTWR53ZZBKTQXAB3AU988XF4V")
    let randomPort = 3000;
    startGathering(5000)
    await startListening(randomPort)
    const BaseURL = `http://localhost:${randomPort}`
    const startTime = new Date()
    const response1 = await axios.get(`${BaseURL}/average?fromTime=${fromInterval}&toTime=${toInterval}`)
    const response2 = await axios.get(`${BaseURL}/gas`)
    const endTime = new Date()
    const elapsedTime = endTime.getTime() - startTime.getTime()
    console.log(`elapsed time: ${elapsedTime}`)
    await sleep(7000);
    log(response1.data.message)
    log(response2.data.message)
}

async function test2() {
    const fromInterval = UTCToTimestamp("Jun-20-2022 04:50:54 PM +0000")
    const toInterval = UTCToTimestamp("Jun-20-2022 04:51:21 PM +0000")
    const futureTime1 = UTCToTimestamp("Jun-28-2022 04:50:54 PM +0000")
    const futureTime2 = UTCToTimestamp("Jun-28-2022 04:51:21 PM +0000")
    console.log('from Interval: ', fromInterval)
    console.log('to Interval: ', toInterval)

    let provider = getDefaultGasProvider()
    provider.setAPIKey("3VD5A4RPGYTWR53ZZBKTQXAB3AU988XF4V")
    let randomPort = 3000;
    startGathering(5000)
    const time1 = DateToTimestamp(new Date())
    await sleep(15000)
    const time2 = DateToTimestamp(new Date())
    await sleep(15000)
    await startListening(randomPort)
    const BaseURL = `http://localhost:${randomPort}`
    const startTime = new Date()
    const response3 = await axios.get(`${BaseURL}/average?fromTime=${futureTime1}&toTime=${futureTime2}`)
    log(response3.data.message)
    const response1 = await axios.get(`${BaseURL}/average?fromTime=${fromInterval}&toTime=${toInterval}`)
    const response2 = await axios.get(`${BaseURL}/gas`)
    const endTime = new Date()
    const elapsedTime = endTime.getTime() - startTime.getTime()
    console.log(`elapsed time: ${elapsedTime}`)
    await sleep(10000);
    log(response1.data.message)
    log(response2.data.message)
    stopListening()
    stopGathering()
    process.exit(0)
}

async function test3() {
    let provider = getDefaultGasProvider()
    provider.setAPIKey("3VD5A4RPGYTWR53ZZBKTQXAB3AU988XF4V")
    let randomPort = 3000;
    startGathering(5000)
    const time1 = DateToTimestamp(new Date())
    await sleep(15000)
    const time2 = DateToTimestamp(new Date())
    await sleep(15000)
    await startListening(randomPort)
    const BaseURL = `http://localhost:${randomPort}`
    const startTime = new Date()
    const response3 = await axios.get(`${BaseURL}/average?fromTime=${time1}&toTime=${time2}`)
    log(response3.data.message)
    stopListening()
    stopGathering()
    process.exit(0)
}

test3()