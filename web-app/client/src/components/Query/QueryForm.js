import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getQueryResults } from '../../actions/query'
import { Form } from 'semantic-ui-react'
import './Query.css'

import TimeOptions       from './QueryFormParts/TimeOptions'
import BayOptions        from './QueryFormParts/BayOptions'
import QuantitiesOptions from './QueryFormParts/QuantitiesOptions'

import { clientIsInDemoMode } from '../../client-mode/mode'


/**
 * NOTE: By default, show both aggregates and per-day quantities.
 * TODO: Fix `react-datepicker` click-away problem.  (I want to be able to
 *       click on the label or to the right of the field to click-out.)
 * UPGRADE: Later, import the selection numbers (N days ago) from elsewhere and
 * have it editable by user (ie, enable "add number", "remove number" from the
 * list).
 * QUESTION: Is this terrible what I'm doing by mixing semantic-ui-react
 *           with other packages?  How can I get the bootstrap ui style?
 */

// SHOULD HAVE DONE ARRAYS!
const quantitiesInit = {
    netSales: {
      combined: true,  cash: false, credit: false,
    },
    netMoney: {
      combined: true, cash: false, credit: false, unRefunded: true,
    },
    vehicles: {
      combined: true,
      cash: false, credit: false, account: false, employee: false,
      works: false, premium: false, deluxe: false, express: false,
    },
}
// LIKE THIS:
// const quantitiesInit = [
//   {
//     title: 'Net Sales',
//     content: [
//       { title: 'combined', content: true  },
//       { title: 'cash',     content: false },
//       { title: 'credit',   content: false },
//     ],
//   },
//   {
//     title: 'Net Money',
//     content: [
//       { title: 'combined',   content: false },
//       { title: 'cash',       content: false },
//       { title: 'credit',     content: false },
//       { title: 'unrefunded', content: true  },
//     ],
//   },
//   {
//     title: 'Vehicles',
//     content: [
//       { title: 'combined', content: true  },
//       { title: 'cash',     content: false },
//       { title: 'credit',   content: false },
//       { title: 'account',  content: false },
//       { title: 'employee', content: false },
//       { title: 'works',    content: false },
//       { title: 'premium',  content: false },
//       { title: 'deluxe',   content: false },
//       { title: 'express',  content: false },
//     ],
//   },
// ]


const daysAgoOptions = [
  { value: '14', label: '14' },
  { value: '7',  label: '7' },
  { value: '6',  label: '6' },
  { value: '5',  label: '5' },
  { value: '4',  label: '4' },
  { value: '3',  label: '3' },
  { value: '2',  label: '2' },
  { value: '1',  label: '1' },
]


const QueryForm = ({isQuerying, today}) => {

  let yesterday = new Date(today)
  let weekAgo = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  weekAgo.setDate(today.getDate() - 7)

  let timeOptionsInit = {
    today,     // not modified by user/form, used by back-end server query
    yesterday, // not modified by user/form, used by back-end server query
    daysAgo: '7',
    intvlStart: weekAgo,
    intvlFinal: yesterday,
    reportDate: yesterday,
    timeSearchSel: ['byNdays'],
  }

  if (clientIsInDemoMode) { timeOptionsInit = getDemoInit() }

  const queryInit = {
    bayOption: 'both',
    quantities: quantitiesInit,
    timeOptions: timeOptionsInit,
  }

  const [queryInput, setQueryInput] = useState(queryInit)
  const dispatch = useDispatch()

  const bayOptionsInput =  { queryInput, setQueryInput }
  const qntsOptionsInput = { queryInput, setQueryInput }
  const timeOptionsInput = { queryInput, setQueryInput, daysAgoOptions }

  const handleQuery = (e) => {
    e.preventDefault()
    dispatch(getQueryResults(queryInput))
  }

  return (
    <div className="query-section-container">
      <Form
        className="query-section"
        onSubmit={handleQuery}
      >
        <div className="side-by-side">
          <BayOptions bayOptionsInput={bayOptionsInput} />
          <QuantitiesOptions qntsOptionsInput={qntsOptionsInput} />
        </div>
        <TimeOptions timeOptionsInput={timeOptionsInput} />
        <button
          id="submit-query"
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isQuerying}
        >
          Submit
        </button>
      </Form>
    </div>
  )
}


function getDemoInit() {

  const demoToday = new Date('7/25/21')
  let demoYesterday = new Date(demoToday)
  let demoWeekAgo = new Date(demoToday)
  demoYesterday.setDate(demoToday.getDate() - 1)
  demoWeekAgo.setDate(demoToday.getDate() - 7)

  const demoTimeOptionsInit = {
    today: demoToday, // not mod'd by user/form, used by back-end server query
    yesterday: demoYesterday, // ditto
    daysAgo: '7',
    intvlStart: demoWeekAgo,
    intvlFinal: demoYesterday,
    reportDate: demoYesterday,
    timeSearchSel: ['byNdays'],
  }

  return demoTimeOptionsInit

}


export default QueryForm