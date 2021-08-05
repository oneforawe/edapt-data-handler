import React from "react"
import { Redirect } from 'react-router-dom'
import { useSelector } from "react-redux"
import './Profile.css'


const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth)

  if (!currentUser) {
    return <Redirect to="/login" />
  }

  return (
    <div className="container">

      <header className="jumbotron">
        <h3>User Profile</h3>
      </header>

      <div className="top-matter">
        <p>
          <strong>Id:</strong> {currentUser.id}
        </p>
        <p>
          <strong>Username:</strong> {currentUser.username}
        </p>
        {/* <p>
          <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)}
          {" "}...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p> */}
      </div>

    </div>
  )
}

export default Profile