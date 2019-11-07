import React, { useEffect } from 'react'
import { useBlockstack, useFile} from 'react-blockstack'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faStar, faShare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import Sidebar, {Menu, MenuItem, Navbar, Row, Col, ColAuto} from "./library/Sidebar"
import { useDrive } from './library/drive'
import Landing from './Landing'
import Drive, {Favorites, Shared, Trash} from './Drive'
import Auth from './Auth'
import Action from './Action'

export default function App (props) {
  const { userData, person, signIn, signOut } = useBlockstack()
  const [drive, dispatch] = useDrive()
  const { dir } = drive
  const navigate = (payload) => dispatch({...payload, action: "navigate"})
  const upload = (files) => dispatch({action: "upload", files: files})
  const createFolder = (name) => dispatch({action: "createFolder", name: name})
  const [history, setHistory] = useFile("config")
  useEffect( () => {
    var d = new Date()
    if (userData && setHistory) {
      setHistory("" + d.toString())
    }
  },[!!userData, !!setHistory])
  return (
   <div className="App">
      {!signIn && !signOut && <div>...</div>}
      {signIn && <Landing />}
      {signOut &&
      <Router>
        <Row className="no-gutters">
          <ColAuto>
            <Sidebar className="border-right bg-primary text-white">
              <div className="w-100 mt-4 mb-5 text-center">
                <Action className="btn-primary mx-auto rounded"
                        createFolder={createFolder}
                        uploadFiles={upload}>
                  <FontAwesomeIcon icon={faPlus}/>
                  <span className="ml-3 mr-2">New</span>
                </Action>
              </div>
              <Menu>
                <MenuItem target="/drive">
                  <FontAwesomeIcon icon={faHdd}/>My Drive
                </MenuItem>
                <MenuItem target="/favorites">
                  <FontAwesomeIcon icon={faStar}/>Favorites
                </MenuItem>
                {false &&
                <MenuItem target="/shared">
                  <FontAwesomeIcon icon={faShare}/>Shared
                </MenuItem>}
                <MenuItem target="/trash">
                  <FontAwesomeIcon icon={faTrash}/>Trash
                </MenuItem>
              </Menu>
            </Sidebar>
          </ColAuto>
          <Col>
            <Navbar className="navbar-dark bg-light">
              <form className="form-inline my-2 my-lg-0">
                { false &&
                  <>
                   <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                   <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                  </> }
              </form>
              <Auth/>
            </Navbar>
            <main className="bg-light">
              <Switch>
                <Route path="/drive" render={(props) => <Drive drive={drive} navigate={navigate}/>}/>
                <Route path="/favorites" render={(props) => <Favorites drive={drive}/>}/>
                <Route path="/shared" render={(props) => <Shared drive={drive}/>}/>
                <Route path="/trash" render={(props) => <Trash drive={drive}/>}/>
                <Redirect exact from="/" to="/drive" />
              </Switch>
            </main>
          </Col>
        </Row>
      </Router>}
      <footer>

      </footer>
  </div>
  )
}
