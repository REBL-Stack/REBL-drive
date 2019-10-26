import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import Auth from './Auth.js'
import ReactBlockstack from 'react-blockstack'
import { AppConfig } from 'blockstack'

// Require Sass file so webpack can build it
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootswatch/dist/simplex/bootstrap.css'

import'./styles/style.css'

const appConfig = new AppConfig(['store_write', 'publish_data'])
ReactBlockstack({appConfig})

ReactDOM.render(<App/>, document.getElementById('App'))
ReactDOM.render(<Auth/>, document.getElementById('Auth'))
