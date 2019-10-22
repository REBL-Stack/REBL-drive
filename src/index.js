import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.js'
import Auth from './Auth.js'
import { initBlockstack } from 'react-blockstack'
import { AppConfig } from 'blockstack'

// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';
import'./styles/style.css';

const appConfig = new AppConfig(['store_write', 'publish_data'])
initBlockstack({appConfig})

ReactDOM.render(<Router><App/></Router>, document.getElementById('root'));
ReactDOM.render(<Auth/>, document.getElementById('auth'));
