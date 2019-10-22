import React from 'react'
import { useBlockstack } from 'react-blockstack'

export default function Auth () {
    const { signIn, signOut } = useBlockstack()
    return (
        <button className="btn btn-secondary"
                disabled={ !signIn && !signOut }
                onClick={ signIn || signOut }>
            { signIn ? "Sign In" : signOut ? "Logout" : "..." }
        </button>
    )
}
