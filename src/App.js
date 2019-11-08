import React, { useEffect } from 'react'
import { useBlockstack, useFile} from 'react-blockstack'
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faStar, faShare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import Sidebar, {Menu, MenuItem, Navbar, Row, Col, ColAuto} from "./library/Sidebar"
import { useDrive } from './library/drive'
import Landing from './Landing'
import Drive, {Favorites, Shared} from './Drive'
import Trash from './Trash'
import Auth from './Auth'
import Action from './Action'
import ErrorBoundary from './ErrorBoundary'

export default function App (props) {
  const { userData, person, signIn, signOut } = useBlockstack()
  const [drive, dispatch] = useDrive()
  const { dir } = drive /// FIX???
  const history = useHistory()
  const navigate = (payload) => {
    dispatch({...payload, action: "navigate"})
    history && history.push("/drive")
  }
  const upload = (files) => dispatch({action: "upload", files: files})
  const createFolder = (name) => dispatch({action: "createFolder", name: name})
  const [config, setConfig] = useFile("config")
  useEffect( () => {
    var d = new Date()
    if (userData && setConfig) {
      setConfig("" + d.toString())
    }
  },[!!userData, !!setConfig])
  return (
   <div className="App">
      {!signIn && !signOut && <div>...</div>}
      {signIn && <Landing />}
      {signOut &&
        <Row className="no-gutters">
          <ColAuto>
            <Sidebar className="border-right">
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
            <Navbar className="navbar-light bg-light">
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
              <ErrorBoundary>
                <Switch>
                  <Route path="/drive" render={(props) => <Drive drive={drive} navigate={navigate}/>}/>
                  <Route path="/favorites" render={(props) => <Favorites drive={drive} navigate={navigate}/>}/>
                  <Route path="/shared" render={(props) => <Shared drive={drive} navigate={navigate}/>}/>
                  <Route path="/trash" render={(props) => <Trash drive={drive} navigate={navigate}/>}/>
                  <Redirect exact from="/" to="/drive" />
                </Switch>
              </ErrorBoundary>
            </main>
          </Col>
        </Row>}
      <footer>

      </footer>
  </div>
  )
}
