import React from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle              , faHdd, faStar, faShare, faTrash, faPlus, faCloud } from '@fortawesome/free-solid-svg-icons'
import config from './config'

function BlockstackInfo (props) {
  return (
    <div className="text-center mb-5">
      <p className="mt-2">
        Who's Blockstack?
        <button className="btn fas text-primary rounded-circle ml-2"
           data-toggle="collapse" data-target="#blockstack-login-info">
           <FontAwesomeIcon icon={faInfoCircle} style={{fontSize: "2em"}}/>
        </button>
      </p>
      <div id="blockstack-login-info" class="collapse hide">
                <div class="row">
                  <p class="alert alert-info col-md-6 m-auto">
                    <a href="https://blockstack.org" target="_blank">Blockstack</a> is a public benefit corporation,
                    creating a decentralized computing network and app ecosystem
                    designed to protect digital rights.</p>
                </div>
      </div>
    </div>)
}

function LandingCloud (props) {
  const { signIn, signOut } = useBlockstack()
  return (
    <div className="Landing">
      <h1 className="landing-heading text-center m-5">
        {process.env.REACT_APP_TITLE}
      </h1>
      <div className="alert alert-dark text-center m-5">
        <FontAwesomeIcon className="my-3" icon={faCloud}
            style={{fontSize: "6em", opacity: "0.3"}}/>
        <p>Free cloud storage of your files, safely encrypted for&nbsp;your&nbsp;eyes&nbsp;only.</p>
        <p>Part of the <a href="https://app.co">Can't Be Evil</a> collection
        of apps on the Blockstack&nbsp;platform.</p>
      </div>
      {(signIn || !signOut) &&
      <div className="lead text-center my-5">
        <button
          className="btn btn-primary btn-lg"
          id="signin-button"
          disabled={ !signIn }
          onClick={ signIn }>
          Sign In with Blockstack
        </button>
      </div>}
      <BlockstackInfo/>
    </div>
  )
}

function LandingVault (props) {
  const { signIn } = useBlockstack()
  return (
    <div className="Landing">
      <h1 className="landing-heading text-center m-5"><i>d</i>Crypt Vault</h1>
      <p className="alert alert-dark text-center m-5">
        Keep files securely stored online using strong encryption.
      </p>
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

export default function Landing (props) {
  switch (config.kind) {
    case "vault":
      return (<LandingVault/>)
    case "cloud":
      return (<LandingCloud/>)
    default:
      return (<div>???</div>)
  }
}
