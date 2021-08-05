import React from "react"
import { Redirect } from 'react-router-dom'
import { useSelector } from "react-redux"

const NotFound = () => {
  const { user: currentUser } = useSelector((state) => state.auth)

  if (!currentUser) {
    return <Redirect to="/login" />
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          Error 404
        </h3>
      </header>
      <p>
        <strong>Page Not Found</strong>
      </p>
      <p>
        Use navigation bar to continue.
      </p>
    </div>
  )
}

export default NotFound