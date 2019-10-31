import React from 'react';
import { useBlockstack } from 'react-blockstack'

export default function Landing (props) {
  const { signIn } = useBlockstack()
  return (
    <div className="Landing">
      <h1 className="landing-heading text-center m-5">REBL Cloud</h1>
      <p className="alert alert-dark text-center">
      Coming soon: A design toolkit for Blockstack app development
      based on <a href="https://rebl.run">React-Blockstack</a>,
      providing React components
      and React hooks to implement file management in Blockstack apps.
      Sign in below to test out an app
      demonstrating&nbsp;the&nbsp;toolkit.
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
