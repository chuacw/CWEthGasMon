import { EtherscanGasProvider } from "../src/etherscanGasProvider"
import { EthGasStationProvider } from "../src/ethGasStationProvider"
import { getDefaultGasProvider, setDefaultGasProvider } from "../src/gasProviders"

jest.mock('../src/etherscanGasProvider') // etherscanGasProvider is now a mock constructor
jest.mock("../src/ethGasStationProvider")

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