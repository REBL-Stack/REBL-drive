import React, { useEffect } from 'react'
import { useBlockstack, useFile} from 'react-blockstack'
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faStar, faShare, faTrash, faPlus, faHeart, faCloud, faDharmachakra } from '@fortawesome/free-solid-svg-icons'
import { isEmpty } from 'lodash'
import { useFavorites, useTrash } from "./library/drive"
import Sidebar, {Menu, MenuItem, Navbar, Row, Col, ColAuto} from "./library/Sidebar"
import { useDrive } from './library/drive'
import Landing from './Landing'
import Drive, {Favorites} from './Drive'
import SharedPane from './SharedPane'
import Trash from './Trash'
import Auth from './Auth'
import ActionSelector from './ActionSelector'
import ErrorBoundary from './ErrorBoundary'
import configuration from './config' // FIX: Conflicting naming with user config
import 'github-fork-ribbon-css/gh-fork-ribbon.css'

const app = configuration.kind

function Footer (props) {
  return (
  <footer className="text-center bg-dark text-light py-5">
    {app == 'vault' &&
     <p>Learn more about encryption with the <a href="https://dcrypt.app"><i>d</i>Crypt</a> app.</p> }
    <p className="m-0 mt-2">
      Made with <FontAwesomeIcon icon={faHeart}/> in San Francisco</p>
    { app == "vault" &&
    <p className="m-0">
      <a href="mailto:hello@dcrypt.app">hello@dcrypt.app</a>
    </p>}
  </footer>)
}

function AppActionSelector (props) {
  const [drive, dispatch] = useDrive()
  const upload = (files) => dispatch({action: "upload", files: files})
  const createFolder = (app != 'vault') && false &&
                       ((name) => dispatch({action: "createFolder", name: name}))
  return (
    <ActionSelector
         className="btn btn-outline-primary btn-lg mx-auto"
         createFolder={createFolder}
         uploadFiles={upload}>
      <FontAwesomeIcon icon={faPlus}/>
      <span className="ml-3 mr-2">New</span>
    </ActionSelector>)
}

function AppNavbar (props) {
  const {className} = props
  const history = useHistory()
  const goHome = () => (history && history.push("/home"))
  return(
  <Navbar className={["navbar-light bg-light text-dark", className].join(" ")}>
    {(configuration.kind == 'vault') &&
       <a className="navbar-brand" onClick={goHome}>
         <span className="text-primary mr-2">
           <FontAwesomeIcon icon={faDharmachakra}/>
         </span>
         <span className="text-dark"><i>d</i>Crypt Vault</span>
       </a>}
    {(configuration.kind == 'cloud') &&
       <a className="navbar-brand" onClick={goHome}>
         <span className="text-primary mr-2"
               style={{fontSize: "120%", opacity: "0.8"}}>
           <FontAwesomeIcon icon={faCloud}/>
         </span>
         <span className="text-light">REBL Cloud</span>
       </a>}
    <form className="form-inline my-2 my-lg-0">
      { false &&
        <>
         <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
         <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </> }
    </form>
    {(false && configuration.kind == 'vault') &&
      <AppActionSelector/>}
    <Auth className="text-white"/>
  </Navbar>)
}

function AppSidebar ({drive}) {
  const [trashed] = useTrash(drive)
  const [favorites] = useFavorites(drive)
  // console.log("TRASHED:", trashed)
  return(
  <Sidebar className="border-right navbar-dark bg-dark text-light">
    <div className="w-100 mt-2 mb-5 pl-4 pr-4 text-left">
      <AppActionSelector/>
    </div>
    <Menu>
      <MenuItem target="/drive">
        <FontAwesomeIcon icon={faHdd}/>My Drive
      </MenuItem>
      <MenuItem target={!isEmpty(favorites) && "/favorites" }>
        <FontAwesomeIcon icon={faStar}/>Favorites
      </MenuItem>
      {false &&
      <MenuItem target="/shared">
        <FontAwesomeIcon icon={faShare}/>Shared
      </MenuItem>}
      <MenuItem target={!isEmpty(trashed) && "/trash"}>
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

function OpenSourceBanner ({placement}) {
  // using github-fork-ribbon-css
  const content = "Fork me on GitHub"
  const href = "https://github.com/REBL-Stack/REBL-drive"
  return (
  <a className={["github-fork-ribbon", (placement || "left-top")].join(" ")}
      href={href}
      data-ribbon={content}
      title={content}>
     {content}
  </a>)
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
   <OpenSourceBanner placement="dark left-bottom"/>
   <Row className="no-gutters">
    <ColAuto>
      <AppSidebar drive={drive}/>
      <AppNavbar className="fixed-top"/>
      <AppNavbar className="invisible"/>
    </ColAuto>
    <Col>
      <AppNavbar className="invisible"/>
      <main className="bg-light d-flex flex-column">
        <ErrorBoundary>
          <Switch>
            <Route path="/home" render={(props) => <Landing />}/>
            <Route path="/drive" render={(props) => <Drive drive={drive} navigate={navigate}/>}/>
            <Route path="/favorites" render={(props) => <Favorites drive={drive} navigate={navigate}/>}/>
            <Route path="/shared" render={(props) => <SharedPane drive={drive} navigate={navigate}/>}/>
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
  <div>
     <div className="App">
      {!signIn && !signOut && <div>...</div>}
      {signIn && <Landing />}
      {signOut && <AppPage/>}
     </div>
     {false &&
      <Footer/>}
   </div>
  )
}
