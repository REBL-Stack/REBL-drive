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
  <footer className="text-center bg-dark py-5">
    <p>Learn more about encryption with the <a href="https://dcrypt.app"><i>d</i>Crypt</a> app.</p>
    <p className="m-0 mt-2">
      Made with <FontAwesomeIcon icon={faHeart}/> in San Francisco</p>
    <p className="m-0">
      <a href="mailto:hello@dcrypt.app">hello@dcrypt.app</a>
    </p>
  </footer>)
}

function AppActionSelector (props) {
  const [drive, dispatch] = useDrive()
  const upload = (files) => dispatch({action: "upload", files: files})
  const createFolder = (app != 'vault') && false &&
                       ((name) => dispatch({action: "createFolder", name: name}))
  return (
    <ActionSelector
         className="btn-outline-primary btn-lg mx-auto rounded-button-circle"
         createFolder={createFolder}
         uploadFiles={upload}>
      <FontAwesomeIcon icon={faPlus}/>
      <span className="ml-3 mr-2">New</span>
    </ActionSelector>)
}

function AppNavbar (props) {
  const {className} = props
  return(
  <Navbar className={["navbar-dark bg-dark", className].join(" ")}>
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
      <AppActionSelector/>}
    <Auth/>
  </Navbar>)
}

function AppSidebar (props) {
  return(
  <Sidebar className="border-right">
    <div className="w-100 mt-4 mb-5 ml-5 text-left">
      <AppActionSelector/>
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
  </Sidebar>)
}

function useConfig () {
    const { userData, person, signIn, signOut } = useBlockstack()
    const [config, setConfig] = useFile("config")
    useEffect( () => {
      var d = new Date()
      if (userData && setConfig) {
        setConfig("" + d.toString())
      }
    },[!!userData, !!setConfig])

}

function AppPage () {
  const { userData, person, signIn, signOut } = useBlockstack()
  const [drive, dispatch] = useDrive()
  const history = useHistory()
  const navigate = (payload) => {
    dispatch({...payload, action: "navigate"})
    history && history.push("/drive")
  }
  useConfig()
  return(
  <>
   <Row className="no-gutters">
     <Col>
       <AppNavbar className="fixed-top"/>
       <AppNavbar className="invisible"/>
     </Col>
   </Row>
   <Row className="no-gutters">
    {(configuration.kind != 'vault') &&
    <ColAuto>
      <AppSidebar/>
    </ColAuto>}
    <Col>
      <main className="bg-light d-flex flex-column">
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
  </Row>
 </>)
}

export default function App (props) {
  const { signIn, signOut } = useBlockstack()
  return (
   <div className="App">
      {!signIn && !signOut && <div>...</div>}
      {signIn && <Landing />}
      {signOut && <AppPage/>}
      <Footer/>
  </div>
  )
}
