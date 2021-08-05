import React from 'react'
import { Form } from 'semantic-ui-react'
import { produce } from 'immer'
import '../Query.css'


const BayOptions = ({bayOptionsInput}) => {
  const { queryInput, setQueryInput } = bayOptionsInput
  const { bayOption } = queryInput

  const setBayOption = (value) => {
    setQueryInput( produce(draftState => {
      draftState.bayOption = value
    }) )
  }

  return (
    <Form.Field className="boxed">

      <div className="query-sub-title">
        Bays
      </div>

      <div className="query-option-space">

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="both"
            checked={bayOption === 'both'}
            onChange={() => setBayOption('both')}
          />
          <label className="form-check-label" htmlFor="both">
            both
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="1"
            checked={bayOption === '1'}
            onChange={() => setBayOption('1')}
          />
          <label className="form-check-label" htmlFor="1">
            1
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="2"
            checked={bayOption === '2'}
            onChange={() => setBayOption('2')}
          />
          <label className="form-check-label" htmlFor="2">
            2
          </label>
        </div>

      </div>

    </Form.Field>
  )
}


export default BayOptions