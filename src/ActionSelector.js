import React, { useRef, useState } from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faFileUpload } from '@fortawesome/free-solid-svg-icons'
import {fromEvent} from 'file-selector'

export default function ActionSelector (props) {
  const {className, uploadFiles, createFolder} = props
  const fileUploader = useRef(null)
  const folderNameRef = useRef(null)
  const dropdownToggleRef = useRef(null)
  const [isCreateFolder, setCreateFolder] = useState()
  const uploadFile = () => {
    console.log("Click...")
    fileUploader.current.click()
  }
  const onFileChange = (evt) => {
    fromEvent(evt).then((files) => uploadFiles(files))
  }
  const onCreateFolder = (evt) => {
    const name = folderNameRef.current.value
    console.log("Create Folder", name, dropdownToggleRef.current)
    createFolder(name)
    // not working: dropdownToggleRef.current.dropdown()
  }
  const simple = (uploadFiles && !createFolder)
  return (
  <div className="">
    <input ref={fileUploader} type="file" onChange={ onFileChange } style={{display: 'none'}}/>
    {simple ?
     <button className="AppActionSelector btn-outline-primary btn-lg ml-0 rounded"
              onClick={ uploadFile }>
        <FontAwesomeIcon icon={faFileUpload}/>
        <span className="ml-2">Upload File</span>
     </button>
     :
     <div className="ActionSelector">
        {/* FIX: Use file-selector instead ??? */}
        <button ref={dropdownToggleRef}
                className={["btn dropdown-toggle", className].join(" ")}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            { props.children }
        </button>
        <div className="dropdown-menu">
         {createFolder &&
          <>
          <a className="dropdown-item" href="#">
            <div>
              <FontAwesomeIcon icon={faFolderPlus}/>
              <span className="ml-2">Create Folder</span>
              <div>
                <input ref={folderNameRef} type="text"
                       style={{maxWidth: "9em"}}/>
                <input type="submit" className="btn btn-primary"
                       value="Create"
                       onClick={onCreateFolder}/>
              </div>
            </div>
          </a>
          <div className="dropdown-divider"></div>
          </>}
          <a className="dropdown-item" onClick={ uploadFile }>
            <FontAwesomeIcon icon={faFileUpload}/>
            <span className="ml-2">Upload File</span>
          </a>
        </div>
      </div>}
    </div>)
}
