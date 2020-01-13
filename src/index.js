import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import Auth from './Auth.js'
import ReactBlockstack from 'react-blockstack'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppConfig } from 'blockstack'
import config from './config'

// Activate bootstrap actions
import $ from 'jquery'
// import Popper from 'popper.js'
// import 'bootstrap/dist/js/bootstrap.bundle.min'

switch(config.kind) {
  case 'drive':
    import('bootswatch/dist/flatly/bootstrap.css')
    import('./styles/style.css')
    break

  case 'cloud':
    // materia, pulse, spacelab, superhero, united
    import('bootswatch/dist/spacelab/bootstrap.css')
    import('./styles/style.css')
    break

  case 'cloud-': // https://fezvrasta.github.io/bootstrap-material-design
    import('bootstrap-material-design/dist/css/bootstrap-material-design.css')
    /*import('jquery').then((JQuery) => {
      import('bootstrap-material-design/dist/js/bootstrap-material-design.js')
      import('./styles/style.css')
    })*/
    break

  case 'vault':
    //import('bootswatch/dist/cyborg/_variables.scss')
    import('./styles/cbe-cyborg.scss')
    //import('bootswatch/dist/cyborg/_bootswatch.scss')
    // import('bootswatch/dist/cyborg/bootstrap.css')
    import('./styles/style.css')
    break

  default:
    import('bootstrap/dist/css/bootstrap.css')
    import('./styles/style.css')
    break
}

const appConfig = new AppConfig(['store_write', 'publish_data'])
ReactBlockstack({appConfig})

ReactDOM.render(<Router><App/></Router>, document.getElementById('App'))
ReactDOM.render(<Auth/>, document.getElementById('Auth'))
