import { getDefaultGasProvider } from '../src/GasProviders';
import { startGathering, stopGathering } from '../src/server';

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    const gatherGasPriceHowOften = 5100
    let provider = getDefaultGasProvider();
    provider.setAPIKey("3VD5A4RPGYTWR53ZZBKTQXAB3AU988XF4V")
    startGathering(gatherGasPriceHowOften)
    await sleep(120 * gatherGasPriceHowOften)
    stopGathering()
}

run()