import React from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faStar, faShare, faTrash, faPlus, faCloud } from '@fortawesome/free-solid-svg-icons'


export default function Landing (props) {
  const { signIn } = useBlockstack()
  return (
    <div className="Landing">
      <h1 className="landing-heading text-center m-5">
        {process.env.REACT_APP_TITLE}
      </h1>
      <div className="alert alert-dark text-center m-5">
      <FontAwesomeIcon icon={faCloud} style={{fontSize: "6em", opacity: "0.3"}}/>
      <p>Free cloud storage of your files, safely encrypted for your eyes only.</p>
      <p>Part of the <a href="https://cantbeevil.app">Can't Be Evil</a> collection
      of apps on the Blockstack platform.</p>
      </div>
      <div className="lead text-center mt-5">
        <button
          className="btn btn-primary btn-lg"
          id="signin-button"
          disabled={ !signIn }
          onClick={ signIn }>
          Sign In with Blockstack
        </button>
      </div>
    </div>
  )
}
