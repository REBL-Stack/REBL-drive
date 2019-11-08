import React, { useState, useEffect, useCallback } from 'react'
import { useBlockstack, useFilesList, useFileUrl, useFile, useFetch } from 'react-blockstack'
import {fromEvent} from 'file-selector'
import _, { isNull, isNil, isEmpty, concat, get, set, merge, isFunction, isEqual, map, filter } from 'lodash'
import { Atom, swap, useAtom, deref} from "@dbeining/react-atom"

class DriveItem {
  // Represents a file or directory in a Drive
  // root: [] // only relevant when using filesystem, better if filepath
  pathname /// name in gaia, required for files, used as id for now
  path: [] // path in virtual drive hierarchy, parent, excluding name
  name: "untitled"
  isDirectory: false
  constructor(obj) {
    Object.assign(this, obj)
  }
}

const rootDefault = ["drive"] // prefix under which files are kept
const dirpathDefault = []

class Drive {
  root = rootDefault // only relevant when using filesystem
  current // current directory shown
  collections: {}
  itemsAtom // atom with id -> DriveItem
  constructor(obj) {
    Object.assign(this, {itemsAtom: Atom.of([]), current: Atom.of(dirpathDefault)}, obj)
  }
}

function insertDriveItems(drive, ...items) {
  // insert one or more drive-item into the drive
  // FIX: Items is array but should be map!
  const {itemsAtom} = drive
  swap(itemsAtom, (current) => [...current, ...items])
}

/* ================================================= */
// File System Access

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

/* ================================================= */

function asDriveItem (root, path) {
  // path is a list of steps with the name being last
  const name = path[path.length - 1]
  const pathname = concat(root, path).join("/")
  const item = new DriveItem({pathname, path: path.slice(0, -1), name})
  return (item)
}

function newFolder (drive, name) {
  // creates and inserts a new folder drive item
  const {root, current} = drive
  const dir = deref(current)
  const pathname = concat(root, dir, [name]).join("/")
  const item = new DriveItem({pathname, path: dir, name, isDirectory: true})
  insertDriveItems(drive, item)
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

function useFiles (dir) {
  // Files in a specific subpath
  const {userSession} = useBlockstack()
  const [files, setFiles] = useState()
  const dirpath = dir && dir.join("/") + "/"
  console.log("USE FILES:", dirpath)
  useEffect( () => {
    if (dirpath) {
      matchingFiles(userSession, dirpath).then(setFiles)
      // Fix: need to be able to cancel
    } else {
      setFiles(null)
    }
  },[userSession, dirpath])
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

/* ========================================================
   COLLECTIONS (generalize into react-blockstack)

   A collection is a Map from an id string to some value.

*/

function internCollectionAtom (drive, label) {
  // Side effect: modifies collections of drive, but OK
  var atom = get(drive, ["collections", label], null)
  if (!atom) {
    atom = Atom.of({})
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

function useCollection (drive, label, removeFalsy) {
  // returns an array of keys in the collection, followed by a getter and setter
  const [collection, setCollection] = useCollectionAtom(drive, label)
  const setter = useCallback((id, value) => {
    setCollection( collection => (removeFalsy && !value)
                                 ? _.omit(collection, id)
                                 : ({...collection, [id]: value}))
  }, [collection])
  const getter = useCallback((id) => get(collection, id), [collection])
  return ([Array.from(Object.keys(collection)), setter, getter])
}

export function useFavorites (drive) {
  return useCollection(drive, "favorites", true)
}

export function useShared (drive) {
  return useCollection(drive, "shared", true)
}

export function useTrash (drive) {
  return useCollection(drive, "trash", true)
}

export function useSelection (drive, pane) {
  // pane is string
  const [selection, setSelected, isSelected] = useCollection(drive, "selection" + (pane || ""))
  const toggle = (item, allowMultiple) => {
    if (!allowMultiple) {
      selection.forEach((pathname) => {
        if (item.pathname != pathname) {
          setSelected(pathname, false)
        }
      })
    }
    setSelected(item.pathname, !isSelected(item.pathname) || undefined)
  }
  return [selection, toggle, item => isSelected(item.pathname) ]
}

export function useFavorite(driveItem) {
  // Testing to see if this is preferable to useFavorites
  // FIX: optimize to avoid generating favorites
  const drive = useAtom(driveAtom)
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const toggle = () => setFavorite(driveItem.pathname, (status) => !status)
  return ([isFavorite(driveItem.pathname), toggle])
}

/* ============================================================== */

function asDriveItemsList (drive, tree) {
  // tree is a map from names to: subitems (if directory), or null if file
  const {root, current, itemsAtom} = drive
  const dir = deref(current)
  const convert = ([name, content]) => {
    const pathname = concat(root, dir).join("/") + "/" + name // + (content ? "/" : "")
    return (new DriveItem({pathname, root, path: dir, name, isDirectory: content}))
  }
  const entriesArray = Array.from(tree.entries())
  const out = entriesArray.map(convert)
  return out
}

export function useLoadDriveItems(drive) {
  // Initialize all drive items from the files in the root
  // Should ultimately be eliminated or just provide backup on failure
  const {root, itemsAtom} = drive
  const files = useFiles(root)
  const [items, setItems] = useStateAtom(itemsAtom)
  console.log("Load Drive Items:", root, itemsAtom, items)
  useEffect( () => {
    if (files) {
      const tree = files && groupFiles(files)
      setItems(tree && asDriveItemsList(drive, tree))
    }
  },[files])
  return (items)
}

export function useDriveBranch(drive) {
  // OUT: Array with top level drive items for the current branch (specified by dir)
  const {current, itemsAtom} = drive
  const [dir, setDir] = useCurrent(drive) // deref(current) // useCurrent instead?
  const [items, setItems] = useStateAtom(itemsAtom)
  // careful with equality, array may be equal even with different order in lodash....
  const branchItems = items && filter(items, (item) => (isEqual(item.path, dir) || item.path == dir))
  console.log("Branch Items:", branchItems, dir, items)
  return (branchItems)
}

export function useDriveItems (drive, ids) {
  // IN: List of ids for drive items to return, or nil for all
  // OUT: Array of matching drive items, in same order
  const {itemsAtom} = drive
  const [items, setItems] = useStateAtom(itemsAtom)
  return (isNil(ids) ? items : map(ids, (id) => _.find(items, (item) => (item.pathname == id))))
}

export function useUpload (drive) {
  // function to handle upload of files and folders into current directory
  const {root, current, itemsAtom } = drive || {}
  const [dir, setDir] = useCurrent(drive)
  const dirpath = dir && (concat(root, dir).join("/") + "/")
  const { userSession } = useBlockstack()
  const [files, setFiles] = useState()
  const [state, setItems] = useStateAtom(itemsAtom)
  const putFile = userSession.putFile
  console.log("DIRPATH:", dirpath, root, dir)
  useEffect( () => {
    if (files) {
      console.log("FILES:", files)
      files.forEach( (file) => {
        const name = file.name
        const pathname = dirpath + name
        const reader = new FileReader()
        reader.onload = () => {
          const content = reader.result
          putFile(pathname, content)
          const item = new DriveItem({pathname, root, path: dir, name, isDirectory: false})
          setItems((items) => [...items, item])
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

export function useCurrent (drive) {
    // Subpath currently in view (excluding root prefix)
    return useStateAtom(drive.current)
}

const driveAtom = Atom.of(new Drive())

export function useDrive () {
  // interface and state for access to a drive
  const drive = useAtom(driveAtom)
  const [dir, setDir] = useCurrent(drive)
  // const setDir = (dir) => swap(driveAtom, (drive => new Drive(merge({}, drive, {dir: dir}))))
  const [upload, uploadStatus] = useUpload(drive)
  const items = useLoadDriveItems(drive)
  console.log("Loaded drive items:", items)
  const dispatch = (event) => {
    console.log("Dispatch:", event)
    switch (event.action) {
      case "upload":
        upload(event.files)
        return null
      case "navigate":
        if (event.item) {
          const {root, path, name} = event.item
          const destination = concat(path, [name])
          console.info("Navigate:", destination )
          setDir(destination )
        } else {
          const destination = event.path
          console.info("Navigate:", destination )
          setDir(destination)
        }
        return (null)
      case "createFolder":
        const {name} = event
        console.info("Create folder:", name)
        newFolder(drive, name)
        return (null)
      default:
        console.warn("Unknown dispatch:", event.action)
    }
  }
  return [drive, dispatch]
}
