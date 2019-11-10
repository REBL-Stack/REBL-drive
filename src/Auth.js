import React from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faEllipsisV, faUserCog, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

import $ from 'jquery'
// import Popper from 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'

import css from './Auth.css'

const profileManagerUrl = "https://browser.blockstack.org/profiles"

export function AuthButton () {
    const { signIn, signOut } = useBlockstack()
    return (
        <button className="btn btn-secondary"
                disabled={ !signIn && !signOut }
                onClick={ signIn || signOut }>
            { signIn ? "Sign In" : signOut ? "Logout" : "..." }
        </button>
    )
}

export default function Auth (props) {
    const {userSession, userData, signIn, signOut, person} = useBlockstack()
    const {username} = userData || {}
    const avatarUrl = (person && person.avatarUrl && person.avatarUrl())
    if ( userSession && userSession.isUserSignedIn() && userSession.isSignInPending()) {
      console.log("Blockstack inconsistency: Already signed in yet signin is pending");
    }
    return (
      <div className="Auth">
         { signOut ?
          <div className="btn-group dropdown">
            <button className="btn text-light dropdown-toggle"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="avatar">
                {avatarUrl ?
                 <img src={ avatarUrl }
                      className="avatar-image" id="avatar-image" />
                 : <FontAwesomeIcon icon={faUserCircle}/>}
                <span className="username">{ username && username.replace(/.id.blockstack$/, "")}</span>
              </span>
              <FontAwesomeIcon icon={faEllipsisV}/>
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item" href={profileManagerUrl} target="_blank">
                <FontAwesomeIcon icon={faUserCog}/>
                <span className="ml-2">Edit Profile</span>
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" onClick={ signOut }>
                <FontAwesomeIcon icon={faSignOutAlt}/>
                <span className="ml-2">Sign out</span>
              </a>
            </div>
          </div>
          : null }

          <span hidden={true}>
            <AuthButton signIn={signIn} signOut={signOut}/>
          </span>
        </div>
    )
}
