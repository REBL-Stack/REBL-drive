import React from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faFileUpload } from '@fortawesome/free-solid-svg-icons'

import $ from 'jquery'
// import Popper from 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'

export default function ActionButton (props) {
    return (
      <>
        <button className={["btn dropdown-toggle", props.className].join(" ")}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            { props.children }
        </button>
        <div className="dropdown-menu">
          <a className="dropdown-item" href={""} target="_blank">
            <FontAwesomeIcon icon={faFolderPlus}/>
            <span className="ml-2">Create Folder</span>
          </a>
          <div class="dropdown-divider"></div>
          <a className="dropdown-item" onClick={ null }>
            <FontAwesomeIcon icon={faFileUpload}/>
            <span className="ml-2">Upload File</span>
          </a>
        </div>
      </>
    )
}
