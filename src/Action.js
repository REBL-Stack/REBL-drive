import React, { useRef } from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faFileUpload } from '@fortawesome/free-solid-svg-icons'
import {fromEvent} from 'file-selector'

export default function ActionButton (props) {
  const {className, onUpload} = props
  const fileUploader = useRef(null)
  const uploadFile =  () => {
    console.log("Click...")
    fileUploader.current.click()
  }
  const onFileChange = (evt) => {
    fromEvent(evt).then((files) => onUpload(files))
  }
  const createFolder = () => null
  return (
      <>
        <input ref={fileUploader} type="file" onChange={ onFileChange } style={{display: 'none'}}/>
        <button className={["btn dropdown-toggle", className].join(" ")}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            { props.children }
        </button>
        <div className="dropdown-menu">
          <a className="dropdown-item" onClick={ props.createFolder }>
            <FontAwesomeIcon icon={faFolderPlus}/>
            <span className="ml-2">Create Folder</span>
          </a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" onClick={ uploadFile }>
            <FontAwesomeIcon icon={faFileUpload}/>
            <span className="ml-2">Upload File</span>
          </a>
        </div>
      </>
    )
}
