import { ConsoleLogProvider } from '../src/consoleLogProvider';
import { getDefaultLogProvider, setDefaultLogProvider } from '../src/logProviders';
jest.mock('../src/consoleLogProvider'); // ConsoleLogProvider is now a mock constructor

afterEach(() => {    
    jest.clearAllMocks();
});

it('LOG_PROVIDER is throw when calling getDefaultLogProvider calling setDefaultLogProvider', () => {
    expect(() => {getDefaultLogProvider()}).toThrow("LOG_PROVIDER not defined!")
});

it("calls ConsoleLogProvider when setDefaultLogProvider is set with the ConsoleLogProvider's name", () => {
    setDefaultLogProvider(ConsoleLogProvider.name)
    getDefaultLogProvider()
    expect(ConsoleLogProvider).toHaveBeenCalledTimes(1);
})