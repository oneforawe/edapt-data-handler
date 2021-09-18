import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { login } from '../actions/auth'
import './Login.css'

import { clientIsInDemoMode } from '../client-mode/mode'


const Login = () => {
  const dispatch = useDispatch()
  const { isLoggingIn, isLoggedIn } = useSelector(state => state.auth)
  const { message } = useSelector(state => state.message)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onChangeUsername = (e) => { setUsername(e.target.value) }
  const onChangePassword = (e) => { setPassword(e.target.value) }

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(login(username, password))
  }

  if (isLoggedIn) {
    return <Redirect to="/database" />
  }

  return (
    <div className="center">
      <div className="col-md-12">

        {clientIsInDemoMode && (
          <div className="card card-container intro-to-demo-mode">
            <h3>DEMO MODE</h3>
            <p>
              Imagine you are the owner of an automatic carwash business and
              you'd like to examine your automatically-generated sales
              reports using this web-app.
            </p>
            <p>
              Imagine the date is 2021 July 25.
            </p>
            <p>
              Use the following to log in:
            </p>
            <div className="single-cell-grid-container">
              <div className="grid-cell-flex-container">
                <div className="demo-mode-login-info flex-container">
                  <div className="info-batch-1 flex-row">
                    <div className="info-type">Username:</div>
                    <div className="info-data">theuser</div>
                  </div>
                  <div className="info-batch-2 flex-row">
                    <div className="info-type">Password:</div>
                    <div className="info-data">thepassword</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={onChangeUsername}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangePassword}
              />
            </div>

            <div className="form-group add-space">
              <button className="btn btn-primary btn-block" disabled={isLoggingIn}>
                {isLoggingIn && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group add-space">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}

          </form>
        </div>

        <div className="bottom-spacing"/>

      </div>
    </div>
  )
}

export default Login