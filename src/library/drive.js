import React, { useState, useEffect } from 'react'
import { useBlockstack, useFilesList, useFileUrl, useFile, useFetch } from 'react-blockstack'
import {fromEvent} from 'file-selector'
import { isNull, concat, get, set } from 'lodash'
import { Atom, swap, useAtom, deref} from "@dbeining/react-atom"

class DriveItem {
  // Represents a file or directory in a Drive
  // root: [] // only relevant when using filesystem, better if filepath
  pathname /// name in gaia, required for files
  dir: [] // path in virtual drive hierarchy, parent, excluding name
  name: "untitled"
  isDirectory: false
  constructor(obj) {
    Object.assign(this, {favorite: true}, obj)
  }
}

class Drive {
  root = [] // only relevant when using filesystem
  dir: [] // current directory shown
  collections: {}
  constructor(obj) {
    Object.assign(this, obj)
  }
}

/* ================================================= */


function matchingFiles (userSession, match) {
  // promise with list of files starting with the path
  const resolveFiles = (resolve, reject) => {
    var files = []
    userSession.listFiles((path) => {
      if (path.startsWith(match)) {
         files.push(path.substr(match.length))
      }
      return(true)
    }).then(() => resolve(files))
      .catch(reject)
  }
  return (new Promise(resolveFiles))
}

function asDriveItem (root, path) {
  // path is a list of steps with the name being last
  const name = path[path.length - 1]
  const pathname = concat(root, path).join("/")
  const item = new DriveItem({pathname, path: path.slice(0, -1), name})
  return (item)
}
/* ================================================= */

export function useFiles (dir) {
  // Files in a specific subpath
  const {userSession} = useBlockstack()
  const [files, setFiles] = useState()
  useEffect( () => {
    if (dir) {
      const dirpath = dir.join("/") + "/"
      matchingFiles(userSession, dirpath).then(setFiles)
      // Fix: need to be able to cancel
    } else {
      setFiles(null)
    }
  },[userSession, dir])
  return(files || [])
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

export function useFileMeta (driveItem) {
  // IN: a full filepath in gaia
  // Properties returned:
  // modified: A datestamp string in a format parseable by Date()
  const pathname = driveItem.pathname
  const [content, setContent] = useFile(pathname)
  const url = useFileUrl(pathname)
  const init = {method: "GET", headers: new Headers({"User-Agent": "curl/7.43.0", "Accept":"*/*"})}
  const response = useFetch(pathname, init)
  console.log("Response:", pathname, !!content, url, response)
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

export function useDriveItem (item) {
  return(item)
}


export function useSelection (drive) {
  const [selection, setSelection] = useState(new Set([]))
  const select = (item, status) => {
      console.log("SELECT:", !isSelected(item), item)
      if (selection.has(item) && !status) {
        setSelection(items => {items.delete(item); return new Set(items)})
      } else {
        setSelection(items => {return new Set(items.add(item))})
      }
    }
  const isSelected = (item) => selection.has(item)
  return [selection, select, isSelected]
}

function internCollectionAtom (drive, label) {
  // Side effect: modifies collections of drive, but OK
  var atom = get(drive.collections, [label], null)
  if (!atom) {
    console.log("INIT COLLECTION", label)
    atom = Atom.of(new Set())
    set(drive.collections, [label], atom)
  }
  return(atom)
}

function useCollectionAtom (drive, label) {
  const atom = internCollectionAtom(drive, label)
  const collection = useAtom(atom)
  const setCollection = (update) => swap(atom, update)
  return [collection, setCollection]
}

function useCollection (drive, label) {
  // returns a collection of DriveItem objects that are favorited
  // const {root, dir} = drive
  const [collection, setCollection] = useCollectionAtom(drive, label)
  const items = collection || new Set()
  console.log("COLLECTION:", items)
  const setStatus = (item, status) => {
    if (!status) {
      setCollection( items => new Set([...items].filter( x => !(x == item))) )
    } else {
      setCollection( items => new Set([...items, item]) )
    }
  }
  const getStatus = (item) => items.has(item)
  return ([items, setStatus, getStatus])
}

export function useFavorites (drive) {
  return useCollection(drive, "favorites")
}

export function useShared (drive) {
  return useCollection(drive, "shared")
}

export function useTrash (drive) {
  return useCollection(drive, "trash")
}

export function useDriveItems(drive) {
  // In: a drive
  // Out: a collection of DriveItem objects representing its files and subdirectories
  const {root, dir} = drive
  const files = useFiles(dir)
  const [state, setState] = useState()
  useEffect( () => {
    const items = files && groupFiles(files)
    const convert = ([name, content]) => {
      const pathname = concat(root, dir).join("/") + "/" + name // + (content ? "/" : "")
      return (new DriveItem({pathname, root, dir: dir, name, isDirectory: content}))
    }
    const entriesArray = Array.from(items.entries())
    const out = entriesArray.map(convert)
    setState(out)
  },[files])
  return (state)
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

const dirpathDefault = ["img"]

const driveAtom = Atom.of(new Drive({dir:dirpathDefault}))

export function useDrive () {
  // interface and state for access to a drive
  const drive = useAtom(driveAtom)
  const [dir, setDir] = useState(dirpathDefault)
  const [upload, uploadStatus] = useUpload({dir: dir})
  const dispatch = (event) => {
    console.log("Dispatch:", event)
    switch (event.action) {
      case "upload":
        upload(event.files)
        return null
      case "navigate":
        if (event.item) {
          const {root, dir, name} = event.item
          setDir(concat(dir, [name]))
        } else {
          setDir(event.dir)
        }
        return (null)
      default:
        console.warn("Unknown dispatch:", event.action)
    }
  }
  useEffect( () => {
    drive.dir = dir
  }, [dir])
  return [drive, dispatch]
}
