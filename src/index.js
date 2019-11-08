import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import Auth from './Auth.js'
import ReactBlockstack from 'react-blockstack'
import { BrowserRouter as Router } from 'react-router-dom'

import { AppConfig } from 'blockstack'

// Require Sass file so webpack can build it
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootswatch/dist/flatly/bootstrap.css'
import'./styles/style.css'

// Activate bootstrap actions
import $ from 'jquery'
// import Popper from 'popper.js'
// import 'bootstrap/dist/js/bootstrap.bundle.min'

const appConfig = new AppConfig(['store_write', 'publish_data'])
ReactBlockstack({appConfig})

ReactDOM.render(<Router><App/></Router>, document.getElementById('App'))
ReactDOM.render(<Auth/>, document.getElementById('Auth'))
