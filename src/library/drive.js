import React, { useState, useEffect, useCallback } from 'react'
import { useBlockstack, useFilesList, useFileUrl, useFile, useFetch } from 'react-blockstack'
import {fromEvent} from 'file-selector'
import { isNull, concat, get, set, merge, isFunction } from 'lodash'
import { Atom, swap, useAtom, deref} from "@dbeining/react-atom"

class DriveItem {
  // Represents a file or directory in a Drive
  // root: [] // only relevant when using filesystem, better if filepath
  pathname /// name in gaia, required for files
  dir: [] // path in virtual drive hierarchy, parent, excluding name
  name: "untitled"
  isDirectory: false
  constructor(obj) {
    Object.assign(this, obj)
  }
}

class Drive {
  root = [] // only relevant when using filesystem
  dir: [] // current directory shown
  collections: {}
  itemsAtom // id -> DriveItem
  constructor(obj) {
    Object.assign(this, {itemsAtom: Atom.of([])}, obj)
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

function useStateAtom(atom) {
  // Like useState but with an Atom
  // suggest for atom package?
  const state = useAtom(atom)
  const setState = useCallback((update) => {
    if (isFunction(update)) {
      return swap(atom, update)
    } else {
      return swap(atom, (_) => update)
    }
  }, [atom])
  return [state, setState]
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


function internCollectionAtom (drive, label) {
  // Side effect: modifies collections of drive, but OK
  var atom = get(drive, ["collections", label], null)
  if (!atom) {
    atom = Atom.of(new Set())
    set(drive, ["collections", label], atom)
  } else {
  }
  return(atom)
}

function useCollectionAtom (drive, label) {
  const atom = internCollectionAtom(drive, label)
  const [collection, setCollection] = useStateAtom(atom)
  return [collection, setCollection]
}

function useCollection (drive, label) {
  // returns a collection of DriveItem objects that are favorited
  // const {root, dir} = drive
  const [collection, setCollection] = useCollectionAtom(drive, label)
  const items = collection
  console.log("COLLECTION:", items)
  const setStatus =
  useCallback((item, status) => {
    console.log("COLLECTION SET STATUS:", status, item, items)
    if (!status) {
      setCollection( items => new Set([...items].filter( x => !(x == item))) )
    } else {
      setCollection( items => new Set([...items, item]) )
    }
  }, [items])
  const getStatus = (item) => items.has(item)
  return ([Array.from(items), setStatus, getStatus])
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

export function useSelection (drive) {
  const [selection, select, isSelected] = useCollection(drive, "selection")
  const toggle = (item) => {
    select(item, !isSelected(item))
  }
  return [selection, toggle, isSelected ]
}

function asDriveItems (drive, tree) {
  // tree is a map from names to subitems (if directory) or null if file
  const {root, dir, itemsAtom} = drive
  const convert = ([name, content]) => {
    const pathname = concat(root, dir).join("/") + "/" + name // + (content ? "/" : "")
    return (new DriveItem({pathname, root, dir: dir, name, isDirectory: content}))
  }
  const entriesArray = Array.from(tree.entries())
  const out = entriesArray.map(convert)
  return out
}

export function useDriveItems(drive) {
  // In: a drive
  // Out: a collection of DriveItem objects representing its files and subdirectories
  const {root, dir, itemsAtom} = drive
  const files = useFiles(dir)
  const [state, setState] = useStateAtom(itemsAtom)
  useEffect( () => {
    const tree = files && groupFiles(files)
    setState(tree && asDriveItems(drive, tree))
  },[files])
  return (state)
}

export function useUpload (drive) {
  const {root, dir, itemsAtom } = drive || {}
  const dirpath = dir && (dir.join("/") + "/")
  const { userSession } = useBlockstack()
  const [files, setFiles] = useState()
  const [state, setState] = useStateAtom(itemsAtom)
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
          const tree = new Map([])
          tree.set(name, null)
          const extra = asDriveItems(drive, tree)
          setState((items) => [...items, ...extra])
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
  const setDir = (dir) => swap(driveAtom, (drive => new Drive(merge({}, drive, {dir: dir}))))
  const [upload, uploadStatus] = useUpload(drive)
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
  return [drive, dispatch]
}
