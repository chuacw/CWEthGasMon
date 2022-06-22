import { BaseLogProvider } from "./baseLogProvider";

/**
 * A class that logs to the console
 * @date 22/06/2022 - 5:53:21 pm
 *
 * @class ConsoleLogProvider
 * @typedef {ConsoleLogProvider}
 * @extends {BaseLogProvider}
 */
class ConsoleLogProvider extends BaseLogProvider {
    
    /**
     * Logs a message to the console
     * @date 22/06/2022 - 5:53:21 pm
     *
     * @param {string} message
     */
    log(message: string): void {
        console.log(message)
    }
}

export {
    ConsoleLogProvider
}