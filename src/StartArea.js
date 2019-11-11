import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faUpload, faCloudUploadAlt, faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { useDrive } from './library/drive'

function Dropzone({onDrop}) {
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="w-100 flex-grow-1 d-flex" {...getRootProps()}>
      <input {...getInputProps()} />
      { isDragActive &&
        <div className="m-auto text-center align-middle pb-5">
          <FontAwesomeIcon icon={faCompressArrowsAlt}
             className="text-primary" style={{fontSize: "6em"}}/>
          <p>Drop the file here</p>
        </div>}
      { !isDragActive &&
        <div className="m-auto text-center align-middle pb-5">
          <FontAwesomeIcon icon={faFileUpload}
             className="text-primary" style={{fontSize: "6em"}}/>
          <p className="mt-3">
            Drop a file here, or click to open filebrowser.
          </p>
          <p className="mt-3">
            Files are securely encrypted for your privacy.
          </p>
        </div>}
    </div>
  )
}

export default function StartArea (props) {
  const [drive, dispatch] = useDrive()
  const onDrop = useCallback(files => {
      const upload = (files) => dispatch({action: "upload", files: files})
      console.log("Drop:", files)
      upload(files)
    }, [dispatch])
  return (
   <Dropzone onDrop={onDrop}/>
  )
}
