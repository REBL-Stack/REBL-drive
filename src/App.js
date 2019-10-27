import React from 'react'
import { useBlockstack} from 'react-blockstack'
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
  const { dir } = Object.assign({dir: ["img"]}, drive)
  const navigate = (dir) => dispatch({action: "navigate", dir: dir})
  const upload = (files) => dispatch({action: "upload", files: files})
  return (
   <div className="App">
      {!signIn && !signOut && <div>Authenticating...</div>}
      {signIn && <Landing />}
      {signOut &&
      <Router>
        <Row className="no-gutters">
          <ColAuto>
            <Sidebar className="border-right bg-light">
              <div className="w-100 mt-4 mb-5 text-center">
                <Action className="btn-primary mx-auto rounded"
                        onUpload={upload}>
                  <FontAwesomeIcon icon={faPlus}/>&nbsp;
                </Action>
              </div>
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
              <Auth/>
            </Navbar>
            <main className="bg-light">
              <Switch>
                <Route path="/drive" render={(props) => <Drive drive={drive} navigate={navigate}/>}/>
                <Route path="/favorites" render={(props) => <Favorites drive={drive}/>}/>
                <Route path="/shared" render={(props) => <Shared />}/>
                <Route path="/trash" render={(props) => <Trash />}/>
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
