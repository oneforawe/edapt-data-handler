import React from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getDbFile } from '../actions/file'
import downloadIcon from '../images/download-icon.svg'
import checkmarkIcon from '../images/check-circle-icon.svg'
import './Database.css'

import GoToTop from './GoToTop'
import QueryForm        from './Query/QueryForm'
import QueryFormExample from './Query/QueryFormExample'
import QueryResult      from './Query/QueryResult'

import { clientIsInExampleMode } from '../client-mode/mode'


const Database = () => {

  const { user: currentUser } = useSelector((state) => state.auth)
  const { message } = useSelector(state => state.message)
  const {
    isQuerying, queryResult, queryFailed, //query,
  } = useSelector(state => state.query)

  const today = new Date()

  if (!currentUser) {
    return <Redirect to="/login" />
  }

  return (
    <div className="container">

      {/* Scroll to top of page on arrival (ie, when route path changes). */}
      <GoToTop/>

      <header className="jumbotron">
        <h3>Database</h3>
      </header>

      <div className="top-matter">
        <p>
          The database contains selected information from the daily email sales
          reports for your carwash business.
        </p>
        <FileInteractor today={today}/>
        <p>
          Use the form below to query the database for sales information.
        </p>
      </div>

      <hr/>

      <h5>
        Query Form
      </h5>
        {clientIsInExampleMode ? (
          <QueryFormExample
            isQuerying={isQuerying}
          />
        ) : (
          <QueryForm
            isQuerying={isQuerying}
          />
        )}

      <hr/>

      {/* <h5>
        Last Query
      </h5>
        {query && (
          <div>
            {JSON.stringify(query)}
          </div>
        )}

      <hr/> */}

      <h5>
        Query Results
      </h5>
        {/* Have a little popper/hover-info-box that shows this info:
        // "netMoneyCalc" is strictly about (cash & credit) money in vs money out.
        // netMoneyCalc
        // = cashNet + creditNet
        // = (cashIn - cashOut) + (creditIn - creditRefunds)
        // = (cashIn - cashNotRef - cashOut + creditIn - creditRef) + cashNotRef
        //              ^ "cashNotRefunded" is cash that should have been given back
        //                to customers but wasn't. This is "cash in" that's not
        //                strictly part of sales, so it must be subtracted to get the
        //                true sales value.
        // = salesTotal + cashNotRefunded */}
        {isQuerying && (
          <div>
            <span className="spinner-border spinner-border-sm"></span>
          </div>
        )}
        {queryFailed && message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}
        {queryResult && (
          <QueryResult
            queryResult={queryResult}
          />
        )}

      <hr/>

    </div>
  )
}



function FileInteractor({today}) {

  const { message } = useSelector(state => state.message)
  const { isGettingFile, filename, getFileFailed } = useSelector(state => state.file)
  const dispatch = useDispatch()

  const getDatabaseFile = async () => {
    dispatch(getDbFile({ getDbFile: true, today }))
  }

  return (
    <div className="paragraph-like">
      {!isGettingFile && (
        <img
          onClick={() => getDatabaseFile()}
          src={downloadIcon} alt="Download CSV" className="icon-space clicky"
        />
      )}
      {isGettingFile && (
        <span
          className="spinner-border spinner-border-sm icon-space">
        </span>
      )}
      Generate and download a CSV file copy of the contents of the database.
      {!isGettingFile && filename && (
        <div>
          <img
            src={checkmarkIcon} alt="Download CSV" className="icon-space"
          />
          <span>Downloaded file: {filename}</span>
        </div>
      )}
      {getFileFailed && message && (
        <div className="alert alert-danger reduced-space" role="alert">
          {message}
        </div>
      )}
    </div>
  )
}


export default Database