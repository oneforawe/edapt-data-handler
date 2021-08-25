const { Op } = require('sequelize')
const {
  dateDiffInDays, dateFromDayDiff, convertDayToWeekday,
} = require('../email-handler/helper-js/date-utilities')
const { refForReportDateInt: dateRef } = require('./config/table')

// dev:
//const util = require('util')


//  QUERY OBJECT
// {
//    bayOption: 'both',
//    quantities: {
//      netSales: {
//        combined: 'true',
//        cash: 'false',
//        credit: 'false'
//      },
//      netMoney: {
//        combined: 'false',
//        cash: 'false',
//        credit: 'false',
//        unRefunded: 'false'
//      },
//      vehicles: {
//        combined: 'true',
//        cash: 'false',
//        credit: 'false',
//        account: 'false',
//        employee: 'false',
//        works: 'false',
//        premium: 'false',
//        deluxe: 'false',
//        express: 'false',
//      }
//    },
//    timeOptions: {
//      reportDate: '2021-06-28T07:24:08.757Z',
//      daysAgo: '7',
//      intvlStart: '2021-06-28T07:24:08.757Z',
//      intvlFinal: '2021-06-28T07:24:08.757Z',
//      timeSearchSel: [ 'byDate' ]
//    }
//  }

// (QUERY) RESULT OBJECT
// {
//    quantities: {
//      netSales: {
//        combined:   result,  (result or no property here)
//        cash:       result,
//        credit:     result,
//      netMoney: {
//        combined:   result,
//        cash:       result,
//        credit:     result,
//        unRefunded: result
//      },
//      vehicles: {
//        combined:   result,
//        cash:       result,
//        credit:     result,
//        account:    result,
//        employee:   result,
//        works:      result,
//        premium:    result,
//        deluxe:     result,
//        express:    result,
//      }
//    },
//    timeOption: {
//      timeSearchSel: [ option ]
//      intervalStr: { start: str, final: str }
//      interval: { start: #, final: #}   // using dateInt (integers)
//        (and keep the relevant info)
//      reportDate: '2021-06-28T07:24:08.757Z',
//      daysAgo: '7',
//      intvlStart: '2021-06-28T07:24:08.757Z',
//      intvlFinal: '2021-06-28T07:24:08.757Z',
//    },
//    dbQuality: {
//      consistency: {
//      },
//      duplicates: {
//      },
//    },
//  }


async function queryTheDatabase(dbConnection, queryObj) {

  if (queryObj.getDbFile) {
    const wholeTableObj = await getWholeTable(dbConnection)
    return { table: wholeTableObj, today: queryObj.today }
  }

  let resultObj = {
    bayOption: {},
    quantities: {},
    timeOption: {},
    dbQualityQuery: {},
  }

  const { bayOption, quantities, timeOptions } = queryObj
  const { netSales, netMoney, vehicles } = quantities
  const {
    today, yesterday,
    daysAgo, intvlStart, intvlFinal, reportDate, timeSearchSel,
  } = timeOptions


  /* BAY **************************************************************/

  let bayIntvl
  switch (bayOption) {
    case '1':
      bayIntvl = [1, 1]
      break;
    case '2':
      bayIntvl = [2, 2]
      break;
    case 'both':
      bayIntvl = [1, 2]
      break;
    default:
      throw new Error('The query parameter ' +
        '`bayOption` has an unrecognized value.')
  }

  resultObj.bayOption = bayOption


  /* TIME *************************************************************/

  //const daysAgoInt = parseInt(daysAgo) // should change `daysAgo` to prevDays
  const prevDaysInt = parseInt(daysAgo)
  const prevDaysDate = dateFromDayDiff(prevDaysInt, dateRef).toISOString()

  const option = { timeZone: 'America/Los_Angeles' }
  const dateString0=(new Date(today)).toLocaleDateString('en-US', option)
  const dateString1=(new Date(yesterday)).toLocaleDateString('en-US', option)
  const dateString2=(new Date(prevDaysDate)).toLocaleDateString('en-US',option)
  const dateString3=(new Date(intvlStart)).toLocaleDateString('en-US', option)
  const dateString4=(new Date(intvlFinal)).toLocaleDateString('en-US', option)
  const dateString5=(new Date(reportDate)).toLocaleDateString('en-US', option)
  const int0 = dateDiffInDays(dateString0, dateRef)
  const int1 = dateDiffInDays(dateString1, dateRef)
  const int2 = int1 - prevDaysInt + 1 // "+1" because including yesterday
  const int3 = dateDiffInDays(dateString3, dateRef)
  const int4 = dateDiffInDays(dateString4, dateRef)
  const int5 = dateDiffInDays(dateString5, dateRef)

  const weekDayString0 = convertDayToWeekday(dateString0) // today
  const weekDayString1 = convertDayToWeekday(dateString1) // yesterday

  // modify dates to be ammenable to database interaction
  const timeOptionsMod = {
    yesterDate:  { string: dateString1, int: int1 },
    daysAgoDate: { string: dateString2, int: int2 },
    intvlStart:  { string: dateString3, int: int3 },
    intvlFinal:  { string: dateString4, int: int4 },
    reportDate:  { string: dateString5, int: int5 },
    timeSearchSel: timeSearchSel[0],
  } // `daysAgoDate` should be `prevDaysDate`

  let interval
  switch (timeOptionsMod.timeSearchSel) {
    case 'byNdays':
      interval = {
        start: timeOptionsMod.daysAgoDate.int,
        final: timeOptionsMod.yesterDate.int,
      }
      intervalStr = {
        start: timeOptionsMod.daysAgoDate.string,
        final: timeOptionsMod.yesterDate.string,
      }
      resultObj.timeOption.daysAgo = daysAgo
      break;
    case 'byInterval':
      interval = {
        start: timeOptionsMod.intvlStart.int,
        final: timeOptionsMod.intvlFinal.int,
        days: timeOptionsMod.intvlFinal.int
          - timeOptionsMod.intvlStart.int + 1,
        // "+1" because inclusive of start and final days
      }
      intervalStr = {
        start: timeOptionsMod.intvlStart.string,
        final: timeOptionsMod.intvlFinal.string,
        startwkday: convertDayToWeekday(intvlStart),
        finalwkday: convertDayToWeekday(intvlFinal),
      }
      resultObj.timeOption.intvlStart = intvlStart
      resultObj.timeOption.intvlFinal = intvlFinal
      break;
    case 'byDate':
      interval = {
        start: timeOptionsMod.reportDate.int,
        final: timeOptionsMod.reportDate.int,
      }
      intervalStr = {
        start: timeOptionsMod.reportDate.string,
        final: timeOptionsMod.reportDate.string,
      }
      resultObj.timeOption.reportDate = timeOptionsMod.reportDate.string
      break;
    default:
      throw new Error('The query parameter ' +
        '`timeSearchSel` has an unrecognized value.')
  }
  resultObj.timeOption = {
    ...resultObj.timeOption,
    timeSearchSel: timeOptionsMod.timeSearchSel, interval, intervalStr,
  }
  refDays = {
    today:     { int: int0, string: dateString0, weekDay: weekDayString0 },
    yesterday: { int: int1, string: dateString1, weekDay: weekDayString1 },
  }


  /* QUANTITIES *******************************************************/

  multiSubQueries = {
    netSales: {
      bayIntvl,
      Options: netSales,
      cols: {
        orgCol: 'reportDateInt',
        altCols: ['reportForDate', 'reportForWeekday'], /* The entries in
        altCols must be equivalent (that is isomorphic, not equal) to orgCol */
        argCols: ['salesTotal','salesCash','salesCredit'],
        resCols: ['combined','cash','credit']
      },
      interval,
      refDays,
    },
    netMoney: {
      bayIntvl,
      Options: netMoney,
      cols: {
        orgCol: 'reportDateInt',
        altCols: ['reportForDate', 'reportForWeekday'], /* The entries in
        altCols must be equivalent (that is isomorphic, not equal) to orgCol */
        argCols: ['netMoneyCalc','cashNet','creditNet','cashNotRefunded'],
        resCols: ['combined','cash','credit','unRefunded'],
        //        combined = cash + credit
        //        combined = netSales(combined) + unRefunded
      },
      interval,
      refDays,
    },
    vehicles: {
      bayIntvl,
      Options: vehicles,
      cols: {
        orgCol: 'reportDateInt',
        altCols: ['reportForDate', 'reportForWeekday'], /* The entries in
        altCols must be equivalent (that is isomorphic, not equal) to orgCol */
        argCols: [
          'unitsWashTotal',
          'unitsWashCash', 'unitsWashCredit',
          'unitsWashAccount', 'unitsWashEmployee',
          'unitsWashD', 'unitsWashE', 'unitsWashW', 'unitsWashP',
        ],
        resCols: [
          'combined',
          'cash','credit','account','employee',
          'works','premium','deluxe','express'
        ],
      },
      interval,
      refDays,
    },
  }

  const dbQualityQuery =  {
    // WRITE THIS ONE TOO
    consistency: {
    },
    duplicates: {
    },
  }


  for (let [subQueryType, subQuery] of Object.entries(multiSubQueries)) {
    resultObj.quantities[subQueryType] =
      await getQtyResult(dbConnection, subQuery)
  }

  //console.log(util.inspect(resultObj, false, null, true /* enable colors */))
  const resultArr = objToArray(resultObj)
  return resultArr
}





async function getQtyResult(dbCnxn, subQuery) {

  let resultSubObj = {}

  let miniQuery, cols
  let resCols = subQuery.cols.resCols
  for (let [qtySubCategory, isSelected] of Object.entries(subQuery.Options)) {
    isSelected = parseStringToBoolean(isSelected)
    if (isSelected) {
      for (let [index, argCol] of subQuery.cols.argCols.entries()) {
        if (resCols[index] === qtySubCategory) {
          cols = {
            orgCol: subQuery.cols.orgCol,
            altCols: subQuery.cols.altCols,
            argCol,
            resCol: resCols[index],
          }
          miniQuery = { ...subQuery, cols }
          resultSubObj[qtySubCategory] = {}
          resultSubObj[qtySubCategory].aggregate =
            await getQtyAggregate(dbCnxn, miniQuery)
          resultSubObj[qtySubCategory].perDayArr =
            await getQtyPerDayArr(dbCnxn, miniQuery)
        }
      }
    }
  }

  return resultSubObj
}






/* Sequelize Queries *********************************************************/

async function getWholeTable(dbConnection) {
  const { Reports: Model } = dbConnection
  let wholeTable = await Model.findAll()
    .then(data => data.map(row => row.dataValues))
  return wholeTable
}

async function getQtyPerDayArr(dbConnection, miniQuery) {
  const { sequelize, Reports: Model } = dbConnection
  const { bayIntvl, cols, interval, refDays } = miniQuery

  const { orgCol, altCols, argCol, resCol } = cols
  const { start, final } = interval

  let quantityPerDayArray = await Model.findAll({
    attributes: [
      orgCol,
      ...altCols.map(col =>
        [sequelize.fn('ANY_VALUE', sequelize.col(col)), col] // See note [1].
      ),
      //[sequelize.fn('SUM', sequelize.col(argCol)), resCol],
      [sequelize.fn('SUM', sequelize.col(argCol)), 'netForDay'],
    ],
    group: [orgCol],
    order: [orgCol],
    where: {
      [Op.and]: [
        { [orgCol]: {[Op.between]: [start, final]} },
        { bay:      {[Op.between]: bayIntvl}       },
      ]
    }
  })
  .then(data => data.map(row => row.dataValues))

  quantityPerDayArray = perDayMissingToNA(quantityPerDayArray, interval)

  return quantityPerDayArray
}


async function getQtyAggregate(dbConnection, miniQuery) {
  const { sequelize, Reports: Model } = dbConnection
  const { bayIntvl, cols, interval } = miniQuery

  const { orgCol, argCol, resCol } = cols
  const { start, final } = interval

  let quantityAggregate = await Model.findAll({
    attributes: [
      //[sequelize.fn('SUM', sequelize.col(argCol)), resCol],
      [sequelize.fn('SUM', sequelize.col(argCol)), 'net'],
    ],
    where: {
      [Op.and]: [
        { [orgCol]: {[Op.between]: [start, final]} },
        { bay:      {[Op.between]: bayIntvl}       },
      ]
    }
  })
  .then(data => data.map(row => row.dataValues))

  quantityAggregate = aggregateMissingToNA(quantityAggregate)

  return quantityAggregate
}


/* Trivial Test Query ********************************************************/

async function getReport(Model) {
  const reportArray = await Model.findAll({
    where: {
      id: { [Op.eq]: 1 }
    }
  })
  .then(data => data.map(row => row.dataValues))
  return reportArray
}


/* Helpers *******************************************************************/

function parseStringToBoolean(string) {
  if (string === 'true') { return true }
  if (string === 'false') { return false }
  throw new Error('Expected a string ' +
    'of either \'true\' or \'false\' but got neither.')
}


/**
 * Let's say we expect
 * ARRAY = [ {Mon}, {Tue}, {Wed}, {Thu}, {Fri} ]
 * but instead it is
 * array = [ {Tue}, {Thu} ]
 */


function perDayMissingToNA(array, interval) {
  const { start, final } = interval
  const lastIndex = array.length - 1
  let newArray = []
  let index = 0
  let date, weekday
  if (array.length === 0) {
    for (let i=start; i<=final; i++) {
      date = dateFromDayDiff(i, dateRef).toLocaleDateString()
      weekday = convertDayToWeekday(date)
      newArray.push({
        reportDateInt:    i,
        reportForDate:    date,
        reportForWeekday: weekday,
        netForDay:        'N/A',
      })
    }
  }
  else {
    for (let i=start; i<=final; i++) {
      if (i !== array[index].reportDateInt) {
        date = dateFromDayDiff(i, dateRef).toLocaleDateString()
        weekday = convertDayToWeekday(date)
        newArray.push({
          reportDateInt:    i,
          reportForDate:    date,
          reportForWeekday: weekday,
          netForDay:        'N/A',
        })
      }
      else {
        newArray.push(array[index])
        if (index < lastIndex) { index++ }
      }
    }
  }
  return newArray
}

function aggregateMissingToNA(array) {
  let newArray = []
  if (array[0].net === null) {
    newArray.push({ net: 'N/A' })
  }
  else {
    newArray = array
  }
  return newArray
}


/* Object transformation ******/
// IF I CREATE THE OBJECTS AS ARRAYS IN THE FIRST PLACE, THAT WOULD BE BETTER.
// For now, just use this:
function objToArray(resultObj) {

  const bayOption  = resultObj.bayOption
  const timeOption = resultObj.timeOption


  const qtyTypes = ['netSales', 'netMoney', 'vehicles']
  const qtyTitles = ['Net Sales', 'Net Revenue', 'Vehicles']
  const qtySubTypes = [
    ['combined', 'cash', 'credit'],
    ['combined', 'cash', 'credit', 'unRefunded'],
    ['combined',
    'cash', 'credit', 'account', 'employee',
    'works', 'premium', 'deluxe', 'express',
    ],
  ]
  const qtySubTypeTitles = [
    ['combined', 'cash', 'credit'],
    ['combined', 'cash', 'credit', 'unrefunded'],
    ['combined',
    'cash', 'credit', 'account', 'employee',
    'works', 'premium', 'deluxe', 'express',
    ],
  ]

  let dbQualityAlert = []
  let qtyDisplayDeepArr = []

  let content = []
  let subcontent = []
  qtyTypes.forEach((type, i) => {
    qtySubTypes[i].forEach((subType, j) => {
      if (resultObj.quantities[type][subType]) {
        subcontent = [
          { title: 'net',     content: resultObj.quantities[type][subType].aggregate },
          { title: 'per-day', content: resultObj.quantities[type][subType].perDayArr },
        ]
        content.push(
          { title: qtySubTypeTitles[i][j], content: subcontent }
        )
      }
    })
    qtyDisplayDeepArr.push(
      { title: qtyTitles[i], content }
    )
    // reset for the next iteration
    content = []
  })

  // Extract dbQuality data.
  // <code here>

  const displayDeepArr = [
    { title: 'Bay Selection',       content: bayOption },
    { title: 'Time Selection',      content: timeOption },
    { title: 'Quantity Selections', content: qtyDisplayDeepArr },
    { title: 'Database Alert',      content: dbQualityAlert },
  ]

  return displayDeepArr
}


/**
 * NOTES
 * [1] It is a bit of a hack/kludge to be using ANY_VALUE (at ~random) in a
 *     group-by construction since the values it is drawing from should all be
 *     the same.  (IE, reportDateInt, reportForDate, and reportForWeekday
 *     should be isomorphic, changing at the same time.)
 *     The code could potentially be written better to ensure this is the case.
 */


const databaseToolsExports = { getReport, queryTheDatabase, getWholeTable }

module.exports = databaseToolsExports