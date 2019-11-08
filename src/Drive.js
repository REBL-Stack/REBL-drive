import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty, drop } from 'lodash'
import filesize from 'filesize'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"
import config from "./config"
import FilesTable from './Table'

const toggler = (selection, getter, setter) =>
     () => {
      const item = selection[0]
      const change = !getter(item)
      console.log("TOGGLE:", item, change)
      selection.forEach((item) => {
        setter(item, change)
      })
    }

export function ToggleTrash (props) {
  const {drive, pane} = props
  const [selection, select, isSelected] = useSelection(drive, pane)
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const toggleTrashed = toggler(selection, isTrashed, setTrashed)
  return (
    <button type="button" className="btn btn-light btn-rounded"
            onClick={toggleTrashed}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
  )
}

export function ToggleFavorite (props) {
  const {drive, pane} = props
  const [selection, select, isSelected] = useSelection(drive, pane)
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const toggleFavorite = toggler(selection, isFavorite, setFavorite)
  return (
    <button type="button" className="btn btn-light btn-rounded"
          onClick={toggleFavorite}>
     <FontAwesomeIcon icon={faStar}/>
   </button>
  )
}

export function ActionBar (props) {
  const {drive, pane, children, className} = props
  const [selection, select, isSelected] = useSelection(drive, pane)
  console.log("SELECTION:", selection, !isEmpty(selection))
  return (
    <div className={["ActionBar", className].join(" ")}>
      {!isEmpty(selection) && children}
    </div>
  )
}

export function Favorites ({drive}) {
  const [favorites, setFavorite, getFavorite] = useFavorites(drive)
  const items = useDriveItems(drive, favorites)
  console.log("Favorities:", favorites, items)
  return (
    <>
      <div className="pane-heading">
        <h4>Favorites</h4>
      </div>
      <FilesTable drive={drive} items={items} pane="favorites"/>
    </>)
}

export function Shared ({drive}) {
  const [items] = useShared(drive)
  return (
    <>
      <div className="pane-heading">
        <h4>Shared</h4>
      </div>
      <FilesTable drive={drive} items={items} pane="shared"/>
    </>)
}

export function Trash ({drive}) {
  const [trashed] = useTrash(drive)
  const items = useDriveItems(drive, trashed)
  return (
    <>
      <div className="pane-heading">
        <h4>Trash</h4>
      </div>
      <FilesTable drive={drive} items={items} pane="trash"/>
    </>)
}

function useDrivePath(drive, location) {
  const trail = location && location.pathname && location.pathname.split('/')
  const path = trail && drop(trail, 2).map(decodeURIComponent)
  return(path || [])
}

export default function Drive ({drive, navigate}) {
  const items = useDriveBranch(drive)
  const [current, setCurrent] = useCurrent(drive)
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const activeItems = items.filter((item) => !isTrashed(item.pathname))
  const title = drive.title || "Drive"
  return(
    <>
     <div className="pane-heading d-flex justify-content-between">
       <Breadcrumb title={title} trail={current} onClick={navigate}/>
       <ActionBar className="mr-4" drive={drive} pane={null}>
         <ToggleTrash drive={drive}/>
         <ToggleFavorite drive={drive}/>
       </ActionBar>
     </div>
     <FilesTable drive={drive} items={activeItems} navigate={navigate} isFavorite={isFavorite}/>
    </>)
}
