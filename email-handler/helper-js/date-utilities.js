const moment = require('moment')
const mtimezone = require('moment-timezone')
/**
 * Note: When using moment-timezone in the browser, you will need to load the
 * data as well as the library.
 */


const  secInMS = 1000         // one second in milliseconds
const  minInMS = 60*secInMS   // one minute in milliseconds
const hourInMS = 60*minInMS   // one hour in milliseconds
const  dayInMS = 24*hourInMS  // one day in milliseconds
const yearInMS = 365*dayInMS  // one year in milliseconds


// function timeObjfromDateDiff(dateDiff) {
//   let years, days, hours, minutes, seconds, milliseconds, excessMS
//   years = Math.trunc(dateDiff/yearInMS)
//   excessMS = dateDiff % yearInMS
//   days = Math.trunc(excessMS/dayInMS)
//   excessMS = excessMS % dayInMS
//   hours = Math.trunc(excessMS/hourInMS)
//   excessMS = excessMS % hourInMS
//   minutes = Math.trunc(excessMS/minInMS)
//   excessMS = excessMS % minInMS
//   seconds = Math.trunc(excessMS/secInMS)
//   milliseconds = excessMS % secInMS
//   return {years, days, hours, minutes, seconds, milliseconds}
// }

function dateDiffInDays(date, dateRef) {
  const dateInMS    = new Date(date).getTime()
  const dateRefInMS = new Date(dateRef).getTime()
  const dayDiff = Math.round((dateInMS - dateRefInMS)/dayInMS)
  // Note: dayDiff can be a positive or negative integer.
  // This rough calculation should be correct over a huge time span.
  // Using `Math.round` helps to account for Daylight Savings Time changes.
  return dayDiff
}

function dateFromDayDiff(dayDiff, dateRef) {
  // dateRef is a string of the form '2021/05/16'
  const dateRefInMS = new Date(dateRef).getTime()
  const dateInMS = dateRefInMS + dayDiff * dayInMS
  const date = new Date(dateInMS)
  return date
}

const months = {
  full: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  abbr: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
}

const days = {
  full: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],
  abbr: [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ],
  a: [
    'U',
    'M',
    'T',
    'W',
    'R',
    'F',
    'S'
  ]
}

const abbrs = {
  EST : 'Eastern Standard Time',
  EDT : 'Eastern Daylight Time',
  CST : 'Central Standard Time',
  CDT : 'Central Daylight Time',
  MST : 'Mountain Standard Time',
  MDT : 'Mountain Daylight Time',
  PST : 'Pacific Standard Time',
  PDT : 'Pacific Daylight Time',
}

mtimezone.fn.zoneName = function () {
  let abbr = this.zoneAbbr()
  return abbrs[abbr] || abbr
}

function localTimeStamp(dateObj) {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localTimeZoneModeAbbr = mtimezone.tz(dateObj,localTimeZone).format('z')
  return `` +
    `${moment(dateObj).format(`` +
      `YYYY-MM-DD[T]HH:mm:ss.SSS (UTCZ|[${localTimeZoneModeAbbr}]) x`
      )}`
}

function localTimeStampWithDay(dateObj) {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localTimeZoneModeAbbr = mtimezone.tz(dateObj,localTimeZone).format('z')
  return `` +
    `${moment(dateObj).format(`` +
      `YYYY-MM-DD[T]HH:mm:ss.SSS ddd (UTCZ|[${localTimeZoneModeAbbr}]) x`
      )}`
}

function localTimeStampShort(dateObj) {
  return `` +
    `${moment(dateObj).format(`` +
      `YYYY-MM-DD[T]HH:mm:ss.SSS`
      )}`
}

function localTimeStampLong(dateObj) {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localTimeZoneMode = mtimezone.tz(dateObj, localTimeZone).format('zz')
  return `` +
    `${moment(dateObj).format(`` +
      `YYYY-MM-DD (YYYY [Week] WW MMMM DD dddd) HH:mm:ss.SSS ` +
      `(UTCZ | [${localTimeZone}] | [${localTimeZoneMode}]) x`)}`
}

function abbrSlashDate(date) {
  // date can be a dateObj or a dateStamp string
  return `${moment(date).format(`M/DD`)}`
}

function convertDayToWeekday(stringDay) {
  const dateObj = new Date(stringDay) // `stringDay` of the form '05/15/2021'
  const weekday = moment(dateObj).format('ddd') // `weekday` of the form 'Sat'
  return weekday
}


const dateUtilitiesExports = {
  secInMS, minInMS, hourInMS, dayInMS, yearInMS,
  months, days,
  localTimeStamp, localTimeStampWithDay,
  localTimeStampShort, localTimeStampLong,
  dateDiffInDays, dateFromDayDiff,
  abbrSlashDate,
  convertDayToWeekday,
}

module.exports = dateUtilitiesExports