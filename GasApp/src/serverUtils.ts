/**
 * The interafec for the 
 * @date 21/06/2022 - 4:57:27 pm
 *
 * @interface ServerResult
 * @typedef {ServerResult}
 */
interface ServerResult {
    /**
     * True if error encountered, false otherwise
     * @date 21/06/2022 - 4:57:27 pm
     *
     * @type {boolean}
     */
    error: boolean;
    /**
     * Contains the error message or JSON object if no error
     * @date 21/06/2022 - 4:57:27 pm
     *
     * @type {string}
     */
    message: string;
}

/**
 * 
 * @date 21/06/2022 - 4:57:27 pm
 *
 * @param {(string | undefined)} aTime Checks if this is undefined, if so, sets up resObj
 * @param {string} name
 * @param {ServerResult} resObj set if aTime is undefined
 * @returns {boolean} true if aTime is undefined, false otherwise
 */
function checkUndefined(aTime: string | undefined, name: string, resObj: ServerResult): boolean {
    if (aTime == undefined) {
        setError(resObj, `${name} is undefined!`)
        return true
    }
    return false
}

/**
 * Sets the message to the current UTC time, with the error message
 * @date 21/06/2022 - 4:57:27 pm
 *
 * @param {ServerResult} resObj The instance to set
 * @param {string} errorMessage Error message to set in resObj
 */
function setError(resObj: ServerResult, errorMessage: string): void {
    resObj.error = true
    const timeNow = new Date().toUTCString();
    resObj.message = `${timeNow}: ${errorMessage}`
}

export {
    checkUndefined, setError,
    ServerResult
}