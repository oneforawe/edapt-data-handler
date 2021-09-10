import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getQueryResults } from '../../actions/query'
import { Form } from 'semantic-ui-react'
import './Query.css'

import TimeOptions       from './QueryFormParts/TimeOptions'
import BayOptions        from './QueryFormParts/BayOptions'
import QuantitiesOptions from './QueryFormParts/QuantitiesOptions'



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


const QueryForm = ({isQuerying}) => {


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





export default QueryForm