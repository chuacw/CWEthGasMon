interface DB_Result {
    dataAvailable: boolean;
    gasPrices: GasPrices;
    blockNum: number;
}

interface GasPrices {
    fast: number;
    average: number;
    low: number;
}

export { DB_Result, GasPrices }