/**
 * interface for a log provider
 * @date 22/06/2022 - 2:08:00 pm
 *
 * @interface BaseLogIntf
 * @typedef {BaseLogIntf}
 */
interface BaseLogIntf {
    /**
     * Logs the given message
     * @date 22/06/2022 - 2:08:00 pm
     *
     * @type {(message: string) => void} 
     */
    log: (message: string) => void
    /**
     * Returns the class name of this provider
     * @date 22/06/2022 - 2:08:00 pm
     *
     * @type {() => string} 
     */
    getName: () => string
}

/**
 * An abstract base class for a log provider
 * @date 22/06/2022 - 2:08:00 pm
 *
 * @abstract
 * @class BaseLogProvider
 * @typedef {BaseLogProvider}
 * @implements {BaseLogIntf}
 */
abstract class BaseLogProvider implements BaseLogIntf {
    /**
     * Creates an instance of BaseLogProvider.
     * @date 22/06/2022 - 2:08:00 pm
     *
     * @constructor
     */
    constructor() {}
    /**
     * Returns the class name of this provider
     * @date 22/06/2022 - 2:08:00 pm
     *
     * @public
     * @returns {string} class name of this provider
     */
    public getName(): string {
        return (<object>this).constructor.name;   
    }
    /**
     * Logs the message, new providers should override this method 
     * @date 22/06/2022 - 2:08:00 pm
     *
     * @abstract
     * @param {string} message The message to be logged
     */
    abstract log(message: string): void
}

export {
  BaseLogIntf, BaseLogProvider
}