import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getQueryResults } from '../../actions/query'
import { Form } from 'semantic-ui-react'
import './Query.css'
import './QueryForm.css'

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


const QueryForm = ({isQuerying}) => {

  const { queryInput } = useSelector(state => state.query)
  const dispatch = useDispatch()

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
          <BayOptions queryInput={queryInput} />
          <QuantitiesOptions queryInput={queryInput} />
        </div>
        <TimeOptions queryInput={queryInput} />
        <div>
          <button
            id="submit-query"
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isQuerying}
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  )
}


export default QueryForm