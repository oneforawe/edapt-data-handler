import reportWebVitals from './reportWebVitals'
import React from 'react'
import ReactDOM from 'react-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import './index.css'

let basedomain
const domain = global.location.hostname
const domainArray = domain.split('.')
if (domainArray.length > 1) {
  basedomain = domainArray.splice(-2)[0]
}
else {
  basedomain = domainArray[0]
}


ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>EDAPT @ {basedomain}</title>
      </Helmet>
    </HelmetProvider>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()