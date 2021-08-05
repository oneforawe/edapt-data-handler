const fs = require('fs')
const { convertDayToWeekday, dateDiffInDays } = require('./date-utilities')
const { refForReportDateInt } = require('../../database-api/config/table')


function parseEmailMsg(msgObj) {

  const emailMsgDate = msgObj.headers.date
  const emailMsgSubject = msgObj.headers.subject
  const bodyAsBase64String = msgObj.bodyAsBase64String

  const isDebugVerbose = false

  if (isDebugVerbose) {
   process.stdout.write(`${emailMsgDate}\t${emailMsgSubject}\t`)
  }

  if (!bodyAsBase64String || !validSubject(emailMsgSubject)) {
    if (isDebugVerbose) { console.log('invalid subject') }
    throw new Error('Message not recognized as a data email message!')
  }

  const bayCheck = parseInt(emailMsgSubject.split(' ')[1])

  const bodyString = Buffer.from(bodyAsBase64String, "base64").toString("utf8")
  const bodyArray = bodyString.split('\r\n')

  if (bodyArray[0] !== '**********************') {
    if (isDebugVerbose) { console.log('invalid body intro') }
    throw new Error('Message not recognized as a data email message!')
  }

  let reportObj, consistencyCheckArray, consistencyArray
  try {
    const reportSendDay = bodyArray[15].split(' ')[1]
    const reportSendTime = bodyArray[16].split(' ')[1]

    const reportForDate = bodyArray[20]
    const reportForWeekday = convertDayToWeekday(reportForDate)
    const reportSendDate = `${reportSendDay} ${reportSendTime}`
    const gmailMsgDate = emailMsgDate
    const bay = parseInt(bodyArray[6].split(' ')[1][1])
    const salesTotal = bodyArray[29].split('$')[1]
    const salesCash = bodyArray[27].split('$')[1]
    const salesCredit = bodyArray[28].split('$')[1]
    const cashIn = bodyArray[55].split('$')[1]
    const cashOut = bodyArray[56].split('$')[1]
    const cashNet = bodyArray[57].split('$')[1]
    const cashNotRefunded = bodyArray[52].split('$')[1]
    const creditIn = bodyArray[79].split('$')[1]
    const creditRefunds = bodyArray[39].split('$')[1]
    const creditNet = bodyArray[81].split('$')[1]

    let offset = 0
    if (bodyArray[94].startsWith('Transactions')) {
      // In most messages (as of 2021-07-06) this line is not in the report.
      offset = 1
    }
    const unitsWashTotal =
      parseInt(bodyArray[105+offset].split('TOTAL')[1].split(' ')[1])
    const unitsWashCash =
      parseInt(bodyArray[101+offset].split('Cash')[1].split(' ')[1])
    const unitsWashCredit =
      parseInt(bodyArray[102+offset].split('Credit')[1].split(' ')[1])
    const unitsWashAccount =
      parseInt(bodyArray[103+offset].split('Account Card')[1].split(' ')[1])
    const unitsWashEmployee =
      parseInt(bodyArray[104+offset].split('Employee Wash')[1].split(' ')[1])
    const unitsWashW =
      parseInt(bodyArray[111+offset].split('SUBTOTAL')[1].split(' ')[1])
    const unitsWashP =
      parseInt(bodyArray[117+offset].split('SUBTOTAL')[1].split(' ')[1])
    const unitsWashD =
      parseInt(bodyArray[123+offset].split('SUBTOTAL')[1].split(' ')[1])
    const unitsWashE =
      parseInt(bodyArray[129+offset].split('SUBTOTAL')[1].split(' ')[1])

    const netMoneyCalc =
      parseFloat( (cents(cashNet) + cents(creditNet))/100 ).toFixed(2)
    // "netMoneyCalc" is strictly about (cash & credit) money in vs money out.
    // netMoneyCalc
    // = cashNet + creditNet
    // = (cashIn - cashOut) + (creditIn - creditRefunds)
    // = (cashIn - cashNotRef - cashOut + creditIn - creditRef) + cashNotRef
    //              ^ "cashNotRefunded" is cash that should have been given
    //                back to customers but wasn't. This is "cash in" that's
    //                not strictly part of sales, so it must be subtracted to
    //                get the true sales value.
    // = salesTotal + cashNotRefunded

    const reportCheckObj = {
      bayCheck,
      bay,
      netMoneyCalc,
      salesTotal,
      salesCash,
      salesCredit,
      cashIn,
      cashOut,
      cashNet,
      cashNotRefunded,
      creditIn,
      creditRefunds,
      creditNet,
      unitsWashTotal,
      unitsWashCash,
      unitsWashCredit,
      unitsWashAccount,
      unitsWashEmployee,
      unitsWashW,
      unitsWashP,
      unitsWashD,
      unitsWashE,
    }

    const {
      reportIsConsistent, consistencyArray, consistencyCheckArray
    } = checkReportConsistency(reportCheckObj)

    const reportDateInt = dateDiffInDays(reportForDate, refForReportDateInt)

    reportObj = {
      reportDateInt,
      reportForDate,
      reportForWeekday,
      reportSendDate,
      gmailMsgDate,
      reportIsConsistent,
      bay,
      netMoneyCalc,
      salesTotal,
      salesCash,
      salesCredit,
      cashIn,
      cashOut,
      cashNet,
      cashNotRefunded,
      creditIn,
      creditRefunds,
      creditNet,
      unitsWashTotal,
      unitsWashCash,
      unitsWashCredit,
      unitsWashAccount,
      unitsWashEmployee,
      unitsWashW,
      unitsWashP,
      unitsWashD,
      unitsWashE,
    }

  }
  catch (err) {
    if (isDebugVerbose) { console.log('some other parsing problem') }
    throw new Error('Message unable to be parsed properly!')
  }

  if (isDebugVerbose) { process.stdout.write(`\n\n`) }

  return reportObj
  // DEBUG:
  //return { reportObj, consistencyCheckArray, consistencyArray, bodyString }
}



function validSubject(subjectString) {
  const subjectArray = subjectString.split(' ')
  const len = subjectArray.length
  return true &&
    (subjectArray[0] === 'Access') &&
    (subjectArray[len - 2] === 'Sales') &&
    (subjectArray[len - 1] === 'Report')
  /* Note: Must use `subjectArray[len - 1]` instead of `subjectArray[4]`
  ** because message parts have an extra space in their subject headers. */
}


function cents(dollarString) {
  const centAmount = parseInt(dollarString.replace('.',''))
  return centAmount
}


function generateMsgStringFile(filename, bodyAsBase64String) {
  const bodyString = Buffer.from(bodyAsBase64String, "base64").toString("utf8")
  fs.writeFileSync(filename, bodyString)
}


function checkReportConsistency(inputObj) {

  const {
    bayCheck,
    bay,
    netMoneyCalc,
    salesTotal,
    salesCash,
    salesCredit,
    cashIn,
    cashOut,
    cashNet,
    cashNotRefunded,
    creditIn,
    creditRefunds,
    creditNet,
    unitsWashTotal,
    unitsWashCash,
    unitsWashCredit,
    unitsWashAccount,
    unitsWashEmployee,
    unitsWashW,
    unitsWashP,
    unitsWashD,
    unitsWashE,
  } = inputObj


  const consistencyCheckArray = [
    {
      lhs: bay,
      rhs: bayCheck,
    },
    {
      lhs: cents(cashNet),
      rhs: cents(cashIn) - cents(cashOut),
    },
    {
      lhs: cents(cashNet),
      rhs: cents(salesCash) + cents(cashNotRefunded),
    },
    {
      lhs: cents(creditNet),
      rhs: cents(creditIn),
      //rhs: cents(creditIn) - cents(creditRefunds),
    },
    {
      lhs: cents(creditNet),
      rhs: cents(salesCredit), // all credit refunds succeed?
    },
    {
      lhs: cents(salesTotal),
      rhs: cents(salesCash) + cents(salesCredit),
    },
    {
      lhs: cents(salesTotal),
      rhs: cents(cashIn) - cents(cashNotRefunded) - cents(cashOut)
        + cents(creditIn),
      //rhs: cents(cashIn) - cents(cashNotRefunded) - cents(cashOut)
      //  + cents(creditIn) - cents(creditRefunds),
    },
    {
      lhs: cents(netMoneyCalc),
      rhs: cents(salesTotal) + cents(cashNotRefunded),
    },
    {
      lhs: unitsWashTotal,
      rhs: unitsWashW + unitsWashP + unitsWashD + unitsWashE,
    },
    {
      lhs: unitsWashTotal,
      rhs: unitsWashCash + unitsWashCredit
        + unitsWashAccount + unitsWashEmployee,
    },
  ]

  const consistencyArray = consistencyCheckArray.map(el => el.lhs === el.rhs)

  const reportIsConsistent = consistencyArray.reduce(
    (accum, el) => accum && el
  )

  const outputObj = {
    reportIsConsistent, consistencyArray, consistencyCheckArray
  }

  return outputObj

}


const parseEmailMsgExports = {
  parseEmailMsg, generateMsgStringFile, checkReportConsistency,
}

module.exports = parseEmailMsgExports