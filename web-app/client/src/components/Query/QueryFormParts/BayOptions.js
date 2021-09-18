import React from 'react'
import { useDispatch } from 'react-redux'
import { setQueryInput } from '../../../actions/query'
import { produce } from 'immer'
import { Form } from 'semantic-ui-react'
import '../Query.css'
import './BayOptions.css'

const bayOptionValues = [ 'both', '1', '2' ]


const BayOptions = ({queryInput}) => {

  const { bayOption } = queryInput
  const dispatch = useDispatch()

  const setBayOption = (value) => {
    const newQueryInput = produce(queryInput, (draftState) => {
      draftState.bayOption = value
    })
    dispatch(setQueryInput(newQueryInput))
  }

  return (
    <Form.Field className="boxed upper-level">

      <div className="query-sub-title">
        Bays
      </div>

      <div className="query-option-space bay">

        {bayOptionValues.map((value, index) => (
          <div className="form-check bay" key={`bayOption-${index}`}>
            <input
              className="form-check-input"
              type="radio"
              id={value}
              checked={bayOption === value}
              onChange={() => setBayOption(value)}
            />
            <label className="form-check-label" htmlFor="both">
              {value}
            </label>
          </div>
        ))}

      </div>

    </Form.Field>
  )
}


export default BayOptions