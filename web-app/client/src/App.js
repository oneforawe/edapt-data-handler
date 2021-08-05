import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Router, Switch, Route, Link } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import Login    from './components/Login'
import Database from './components/Database'
import Profile  from './components/Profile'
import About    from './components/About'
import NotFound from './components/NotFound'

import { logout } from './actions/auth'
import { clearMessage } from './actions/message'

import { history } from './helpers/history'


const App = () => {

  const { user: currentUser } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()) // clear message when changing location
    })
  }, [dispatch])

  const logOut = () => {
    dispatch(logout())
  }

  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">

          <div className="navbar-brand">
            EDAPT
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={'/database'} className="nav-link">
                  Database
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/profile'} className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/about'} className="nav-link">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={'/login'} className="nav-link">
                  LogIn
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/database" component={Database} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/about" component={About} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App