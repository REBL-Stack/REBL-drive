import React, { useState, useEffect } from 'react'
import { useBlockstack, useFilesList, useFileUrl, useFile, useFetch } from 'react-blockstack'
import {fromEvent} from 'file-selector'

export function useFiles (dir) {
  // Files in a specific subpath
  const [files, complete] = useFilesList()
  const dirpath = dir.join("/") + "/"
  const dirfiles = files.filter(path => path.startsWith(dirpath))
                        .map(path => path.substr(dirpath.length))
  return(dirfiles)
}


export function useFavorites () {
  const [value, setValue] = useFile(".favorites")
  const favorites = value && JSON.parse(value)
  const toggleFavorite = (path) => {
    const entry = {}
    entry[path] = !favorites.get(path)
    setValue(JSON.stringify(Object.assign({}, favorites, entry)))
  }
  return [favorites, toggleFavorite]
}


function groupReducer (obj, path) {
  if (path.includes("/")) {
    const name = path.split("/")[0]
    // obj[path] = [...(obj.get(path) || []), path]
    obj.set(name, [...(obj.get(name) || []), path])
  } else {
    obj.set(path, null)
  }
  return (obj)
}

export function groupFiles (files) {
  return(files.reduce(groupReducer, new Map([])))
}

export function renameFile (userSession, path, rename) {
  // skip encryption here for speed?
  // Migrate to react-blockstack but as part of hook? and update filelist?
  userSession.getFile(path)
  .then( content => userSession.putFile(rename, content)
                    .then(() => userSession.deleteFile(path) ))
}

export function useFileMeta (pathname) {
  // Properties returned:
  // modified: A datestamp string in a format parseable by Date()
  const [content, setContent] = useFile(pathname)
  const url = useFileUrl(pathname)
  const init = {method: "GET", headers: new Headers({"User-Agent": "curl/7.43.0", "Accept":"*/*"})}
  const response = useFetch(pathname, init)
  // console.log("Response:", response, response && response.headers)
  const modified = response && response.headers.get("Last-Modified")
  const size = response && response.headers.get("Content-Length")
  const deleteFile = () => setContent(null)
  return({fileUrl: url, modified, size, deleteFile})
}

export function useDirectoryMeta (path) {
  const modified = ""
  const size = ""
  return ({modified, size})
}

export function useDirectoryItems(dir) {
  // In: a directory path list
  // Out: a collection of objects representing its files and subdirectories
  const files = useFiles(dir)
  const items = files && groupFiles(files)
  const convert = ([name, content]) => ({name: name, isDirectory: content})
  const entriesArray = Array.from(items.entries())
  const out = entriesArray.map(convert)
  return (out)
}

export function useUpload (props) {
  const { dir } = props || {}
  const dirpath = dir && (dir.join("/") + "/")
  const { userSession } = useBlockstack()
  const [files, setFiles] = useState()
  const putFile = userSession.putFile
  useEffect( () => {
    if (files) {
      console.log("FILES:", files)
      files.forEach( (file) => {
        const name = dirpath + file.name
        const reader = new FileReader()
        reader.onload = () => {
          const content = reader.result
          putFile(name, content)
        }
      reader.readAsArrayBuffer(file)
      })
      setFiles(null)
    }
  },[files])
  const upload = !files && ((files) => setFiles(files))
  const uploadStatus = !!files // FIX
  return [upload, uploadStatus]
}

export function useDrive () {
  // interface and state for access to a drive
  const [upload, uploadStatus] = useUpload({dir: ["img"]})
  const dispatch = (event) => {
    switch (event.action) {
      case "upload":
        upload(event.files)
        return null
      default:
        console.warn("Unknown dispatch:", event.action)
    }
  }
  const drive = null
  return [drive, dispatch]
}
