import { EtherscanGasProvider } from "../src/etherscanGasProvider"
import { getDefaultGasProvider, setDefaultGasProvider } from "../src/gasProviders"

jest.mock('../src/etherscanGasProvider') // etherscanGasProvider is now a mock constructor

describe('test Base Gas Provider', () => {

    afterEach(() => {    
        jest.clearAllMocks();
    })

    test("throw exception if GAS_PROVIDER is not defined", () => {
        expect(()=>{getDefaultGasProvider()}).toThrow("GAS_PROVIDER not defined!")
    })

    test("throw exception if GAS_PROVIDER is unknown", () => {
        setDefaultGasProvider("UNKNOWN")
        expect(()=>{getDefaultGasProvider()}).toThrow("Default provider cannot be found!")
    })

    test("set GAS_PROVIDER EtherscanGasProvider", () => {
        const setName = EtherscanGasProvider.name
        setDefaultGasProvider(setName)
        const instance = getDefaultGasProvider()
        expect(EtherscanGasProvider).toHaveBeenCalledTimes(1)
    })

})