import React from 'react'
import moment from 'moment'
import './Query.css'
import './QueryResult.css'

// See also notes in QueryForm.js
/**
 * NOTES:    By default, show both aggregates and per-day quantities.
 *           Some of the display is defined in `database-tools.js` in the
 *           `database-api`.  EG: `qtyTitles` and `qtySubTypeTitles`.
 * TODO:     Fix `react-datepicker` click-away problem.  (I want to be able to
 *           click on the label or to the right of the field to click-out.)
 * UPGRADE: Later, import the selection numbers (N days ago) from elsewhere and
 * have it editable by user (ie, enable "add number", "remove number" from the
 * list).
 * QUESTION: Is this terrible what I'm doing by mixing semantic-ui-react
 *           with other packages?  How can I get the bootstrap ui style?
 */
// TODO: turn QuantitiesOptions.js into a more algorithmic display construction


const QueryResult = ({queryResult}) => {

  const resultArr = JSON.parse(queryResult)

  const bayOption  = resultArr[0].content
  const timeOption = resultArr[1].content
  const qtyResults = resultArr[2].content

  const bayMessage  = generateBayMessage(bayOption)
  const timeMessage = generateTimeMessage(timeOption)
  const qtyDisplay  = getQtyDisplay(qtyResults)

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

  return (
    <div className="query-section-container">
      <div className="query-section results">
        <div className="boxed upper-level">
          <div className="query-sub-title">
            <span>{bayMessage} -- {timeMessage}</span>
          </div>
          <div className="query-result-space">
            {qtyDisplay}
          </div>
        </div>
      </div>
    </div>
  )
}



function generateBayMessage(bayOption) {
  let bayMessage
  switch (bayOption) {
    case '1':
      bayMessage = `Bay 1`
      break;
    case '2':
      bayMessage = `Bay 2`
      break;
    case 'both':
      bayMessage = `Bays 1 & 2`
      break;
    default:
      throw new Error('The query parameter ' +
        '`bayOption` has an unrecognized value.')
  }
  return bayMessage

}

function generateTimeMessage(timeOption) {
  let timeMessage
  const { timeSearchSel, intervalStr: intvl, interval: int } = timeOption
  switch (timeSearchSel) {
    case 'byNdays':
      timeMessage = `for the previous ${timeOption.daysAgo} days...`
      break;
    case 'byInterval':
      timeMessage = `for the ${int.days}-day interval ` +
        `from ${intvl.start} (${intvl.startwkday}) to ${intvl.final} (${intvl.finalwkday})...`
      break;
    case 'byDate':
      timeMessage = `for the date of ${timeOption.reportDate}...`
      break;
    default:
      throw new Error('The query parameter ' +
        '`timeSearchSel` has an unrecognized value.')
  }
  return timeMessage
}



function getQtyDisplay(qtyResults) {
  return qtyResults.map((el, index) => (
    <div className="quantity-sub-division" key={index}>
      <div className="quantity-sub-title">
        {el.title}
      </div>
      <div className="quantity-sub-content">
        <div>
          {getQtySubContentDisplay(el.content)}
        </div>
      </div>
    </div>
  ))
}

function getQtySubContentDisplay(arr) {
  return arr.map((el, index) => (
    <div className="quantity-sub-sub-division" key={index}>
      <div className="quantity-sub-sub-title">
        {el.title}
      </div>
      <div className="quantity-sub-sub-content">
        <div className="quantity-sub-sub-net boxed inner-result-container">
          {/* NET */}
          <div className="on-top-title">
            {el.content[0].title}
          </div>
          <div className="on-bottom-data">
            <div className="quantity-sub-sub-sub-division net boxed" key={index}>
              {el.content[0].content[0].net}
            </div>
          </div>
        </div>
        <div className="quantity-sub-sub-per-day boxed inner-result-container">
          {/* PER DAY */}
          <div className="on-top-title">
            {el.content[1].title}
          </div>
          <div className="on-bottom-data">
            {getQtyPerDayDisplay(el.content[1].content)}
          </div>
        </div>
      </div>
    </div>
  ))
}

function getQtyPerDayDisplay(arr) {
  return arr.map((el, index) => (
    <div className="quantity-sub-sub-sub-division per-day" key={index}>
      <div className="day-title">
        {el.reportForWeekday} {abbrSlashDate(el.reportForDate)}
      </div>
      <div className="day-datum">
        {el.netForDay}
      </div>
    </div>
  ))
}

function abbrSlashDate(date) {
  // date can be a dateObj or a dateStamp string
  return `${moment(date, 'MM/DD/YYYY').format('M/DD')}`
}


export default QueryResult