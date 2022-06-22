/**
 * Converts the date to a timestamp in seconds
 * @date 21/06/2022 - 4:57:36 pm
 *
 * @param {Date} date
 * @returns {number}
 */
function DateToTimestamp(date: Date): number {
    const result = Math.floor(date.getTime() / 1000)
    return result
}

export {
    DateToTimestamp
}