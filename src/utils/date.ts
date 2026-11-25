import moment from 'moment-timezone'

/**
 * Formats a given date into a readable string.
 *
 * @param {string | number | Date} time - The date or timestamp to format.
 * @returns {string} Formatted date string in the format "Month, Day, Year".
 */
export function formatDate(time: string | number | Date): string {
  return moment(time).format('MMMM  D, YYYY')
}

/**
 * Formats a range of dates to include the start and end time.
 *
 * @param {string | number | Date} startTime - The start time of the range.
 * @param {string | number | Date} endTime - The end time of the range.
 * @returns {string} Formatted date and time range in the format "Month, Day, Year StartHour - EndHour".
 */
export function formatDateRange(
  startTime: string | number | Date,
  endTime: string | number | Date
): string {
  return `${formatDate(startTime)} ${formatHourRange(startTime, endTime)}`
}

/**
 * Formats a range of hours from a start time to an end time.
 *
 * @param {string | number | Date} startTime - The start time of the range.
 * @param {string | number | Date} endTime - The end time of the range.
 * @returns {string} Formatted hour range in the format "StartHour AM/PM - EndHour AM/PM".
 */
export function formatHourRange(
  startTime: string | number | Date | null,
  endTime: string | number | Date | null
): string {
  if (!startTime || !endTime) {
    return ''
  }
  const formattedStartTime = moment(startTime).format('h:mm A')
  const formattedEndTime = moment(endTime).format('h:mm A')
  return `${formattedStartTime} - ${formattedEndTime}`
}

export function combineDateTime(startTime: string | null) {
  if (!startTime) {
    return null
  }
  // Get today's date
  let today = new Date()

  // Format today's date as YYYY-MM-DD
  let formattedDate = today.toISOString().split('T')[0]

  // Extract time from startTime
  let timePart = startTime.split('T')[1].split('.')[0] // Extract time part and remove milliseconds

  // Combine today's date with time from startTime
  let combinedDateTime = new Date(formattedDate + 'T' + timePart + 'Z')

  return combinedDateTime
}

// So it gets a date and time, combine it and convert it to UTC.
export function combineDateTimeLocal(time, date) {
  // Combine the date and time into a single moment object in local time
  const combined =
    moment(date).format('YYYY-MM-DD') + 'T' + moment(time).format('HH:mm:ss')
  const localDateTime = moment(combined)

  // Convert to UTC
  const utcDateTime = localDateTime.utc()

  return utcDateTime.toISOString()
}
