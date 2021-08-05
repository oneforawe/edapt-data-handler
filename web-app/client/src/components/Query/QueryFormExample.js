import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getQueryResults } from '../../actions/query'


const QueryFormExample = ({isQuerying}) => {
  const [queryExampleInput, setQueryExampleInput] = useState('hi')
  const dispatch = useDispatch()

  const handleQueryExample = (e) => {
    e.preventDefault()
    setQueryExampleInput('hi')
    dispatch(getQueryResults(queryExampleInput))
  }


  return (
    <form onSubmit={handleQueryExample}>
      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isQuerying}
      >
        Submit (Example)
      </button>
    </form>
  )
}

export default QueryFormExample