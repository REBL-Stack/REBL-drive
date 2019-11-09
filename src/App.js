import React, { useEffect } from 'react'
import { useBlockstack, useFile} from 'react-blockstack'
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faStar, faShare, faTrash, faPlus, faHeart, faCloud, faDharmachakra } from '@fortawesome/free-solid-svg-icons'
import Sidebar, {Menu, MenuItem, Navbar, Row, Col, ColAuto} from "./library/Sidebar"
import { useDrive } from './library/drive'
import Landing from './Landing'
import Drive, {Favorites, Shared} from './Drive'
import Trash from './Trash'
import Auth from './Auth'
import ActionSelector from './ActionSelector'
import ErrorBoundary from './ErrorBoundary'
import configuration from './config' // FIX: Conflicting naming with user config

const app = configuration.kind

function Footer (props) {
  return (
  <footer className="text-center bg-dark">
    <p>Learn more about encryption with the <a href="https://dcrypt.app"><i>d</i>Crypt</a> app.</p>
    <p className="m-0 mt-2">
      Made with <FontAwesomeIcon icon={faHeart}/> in San Francisco</p>
    <p className="m-0">
      <a href="mailto:hello@dcrypt.app">hello@dcrypt.app</a>
    </p>
  </footer>)
}

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
  const createFolder = (app != 'vault') && false &&
                       ((name) => dispatch({action: "createFolder", name: name}))
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
          {(configuration.kind != 'vault') &&
          <ColAuto>
            <Sidebar className="border-right">
              <div className="w-100 mt-4 mb-5 ml-5 text-left">
                <ActionSelector
                     className="btn-outline-primary btn-lg mx-auto rounded-button-circle"
                     createFolder={createFolder}
                     uploadFiles={upload}>
                  <FontAwesomeIcon icon={faPlus}/>
                  <span className="ml-3 mr-2">New</span>
                </ActionSelector>
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
          </ColAuto>}
          <Col>
            <Navbar className="navbar-dark bg-dark">
              {(configuration.kind == 'vault') &&
                 <a className="navbar-brand" href="/#">
                   <span className="text-primary mr-2">
                     <FontAwesomeIcon icon={faDharmachakra}/>
                   </span>
                    <i>d</i>Crypt Vault
                 </a>}
              <form className="form-inline my-2 my-lg-0">
                { false &&
                  <>
                   <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                   <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                  </> }
              </form>
              {(configuration.kind == 'vault') &&
              <ActionSelector className="btn-primary mx-auto rounded"
                              createFolder={createFolder}
                              uploadFiles={upload}>
                  <FontAwesomeIcon icon={faPlus}/>
                  <span className="ml-3 mr-2"></span>
              </ActionSelector>}
              <Auth/>
            </Navbar>
            <main className="bg-light d-flex">
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
