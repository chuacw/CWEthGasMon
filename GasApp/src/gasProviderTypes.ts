import { DB_Result } from "./db_types"

interface EthGasStationQueryResult {
    fast: number
    fastest: number
    safeLow: number
    average: number
    block_time: number
    blockNum: number
    speed: number
    safeLowWait: number
    avgWait: number
    fastWait: number
    fastestWait: number
    gasPriceRange: GasPriceRange
}

interface GasPriceRange {
    "4": number
    "6": number
    "8": number
    "10": number
    "20": number
    "30": number
    "40": number
    "50": number
    "60": number
    "70": number
    "80": number
    "90": number
    "100": number
    "110": number
    "120": number
    "130": number
    "140": number
    "150": number
    "160": number
    "170": number
    "180": number
    "190": number
    "210": number
    "230": number
    "250": number
    "270": number
    "290": number
    "300": number
    "310": number
    "330": number
    "350": number
    "360": number
    "370": number
    "390": number
}

interface EtherscanGasInfo {
    LastBlock: string;
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    suggestBaseFee: string;
    gasUsedRatio: string;
}

interface EtherscanGasResult {
    status: string;
    message: string;
    result: EtherscanGasInfo;
}

interface GasProviderIntf {
    getProviderGasPrice: () => Promise<DB_Result>
    resetGasProviderURL: () => void
    setGasProviderURL: (url: string) => void
    setAPIKey: (key: string) => void
    getBlockNumByTimestamp: (timestamp: number) => Promise<number> 
    getEndpoint: () => string
    getName: () => string
}

export {
    EthGasStationQueryResult,
    GasPriceRange,
    EtherscanGasResult,
    EtherscanGasInfo,
    GasProviderIntf   
}