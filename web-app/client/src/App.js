import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'

// Bootstrap style linked by CDN in the index.html file, so no need to import.
//import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'

// Navigation provided by react-bootstrap, paired with react-router
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from 'react-router-bootstrap'

import Login    from './components/Login'
import Database from './components/Database'
import Profile  from './components/Profile'
import About    from './components/About'
import NotFound from './components/NotFound'

import { logout } from './actions/auth'
import { clearMessage } from './actions/message'

import { history } from './helpers/history'

const navItemsWhenLoggedIn = [
  { title: 'Database', link: '/database', action: null    },
  { title: 'Profile',  link: '/profile',  action: null    },
  { title: 'About',    link: '/about',    action: null    },
  { title: 'LogOut',   link: '/login',    action: 'logout'},
]


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

        <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>EDAPT</Navbar.Brand>
            {currentUser && (
              <>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    {generateNavLinks(navItemsWhenLoggedIn, logOut)}
                  </Nav>
                </Navbar.Collapse>
              </>
            )}
          </Container>
        </Navbar>

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


const generateNavLinks = (navItems, logOut) => {
  return navItems.map((itemObj, index) => (
    <NavRouterLink
      key={`nav-item-${index}`}
      obj={itemObj} logOut={logOut}
    />
  ))
}

const NavRouterLink = ({ obj, logOut }) => {
  let onClick
  switch (obj.action) {
    case 'logout':
      onClick = logOut
      break
    default:
      onClick = null
  }
  return (
    <LinkContainer to={obj.link} >
      <Nav.Link onClick={onClick}>{obj.title}</Nav.Link>
    </LinkContainer>
  )
}


export default App