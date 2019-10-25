import React from 'react'
import { useBlockstack} from 'react-blockstack'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faStar, faShare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Sidebar, {Menu, MenuItem, Navbar, Row, Col, ColAuto} from "./library/Sidebar"
import Landing from './Landing.js'
import Main from './Main.js'

export default function App (props) {
  const { userData, person } = useBlockstack()
  return (
   <div className="App">
      {!userData && <Landing />}
      <Router>
        <Row className="no-gutters">
          <ColAuto className="bg-dark text-white">
            <Sidebar>
              <Menu>
                <MenuItem target="/drive">
                  <FontAwesomeIcon icon={faHdd}/>My Drive
                </MenuItem>
                <MenuItem target="/favorites">
                  <FontAwesomeIcon icon={faStar}/>Favorites
                </MenuItem>
                <MenuItem target="/shared">
                  <FontAwesomeIcon icon={faShare}/>Shared
                </MenuItem>
                <MenuItem target="/trash">
                  <FontAwesomeIcon icon={faTrash}/>Trash
                </MenuItem>
              </Menu>
            </Sidebar>
          </ColAuto>
          <Col>
            <Navbar className="navbar-dark bg-light">
              <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
            </Navbar>
            <Switch>
              <Route path="/drive" render={(props) => <Main person={person} />}/>
              <Route path="/favorites" render={(props) => <Main person={person} />}/>
              <Route path="/shared" render={(props) => <Main person={person} />}/>
              <Route path="/trash" render={(props) => <Main person={person} />}/>
            </Switch>
          </Col>
        </Row>
      </Router>
  </div>
  )
}
