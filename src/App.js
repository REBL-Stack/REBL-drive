import React from 'react'
import { useBlockstack} from 'react-blockstack'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Landing from './Landing.js'
import Sidebar from './Sidebar.js'
import Main from './Main.js'

export default function App (props) {
  const { userData, person } = useBlockstack()
  return (
   <div className="App">
      {!userData && <Landing />}
      <Router>
        <div className="row no-gutters">
          <div className="col-auto wrapper">
            <Sidebar />
          </div>
          <div className="col pl-3 pt-3 pr-3">
            XXX
            <Switch>
              <Route path="/drive" render={(props) => <Main person={person} />}/>
              <Route path="/favorites" render={(props) => <Main person={person} />}/>
              <Route path="/shared" render={(props) => <Main person={person} />}/>
              <Route path="/trash" render={(props) => <Main person={person} />}/>
            </Switch>
          </div>
        </div>
      </Router>
  </div>
  )
}
