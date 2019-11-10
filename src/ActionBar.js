import React, {useState, useCallback} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash, faDownload, faTrashRestore } from '@fortawesome/free-solid-svg-icons'
import { isEmpty, drop } from 'lodash'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import config from "./config"

export function toggler (collection, getter, setter) {
  // toggle value(s) in collection based on first value
  // Agnostic to the type of items in the selection
  return(
    (collection && collection[0]) ? (
     () => {
      const item = collection[0]
      const change = item && !getter(item)
      console.log("TOGGLE:", item, change)
      collection.forEach((item) => {
        setter(item, change)
      })
    }
  ) : null)
  }

function useToggler (collection, getter, setter) {
  console.log("USE TOGGLE:", collection)
  const toggle = useCallback(
    toggler(collection, getter, setter),
    [collection, getter, setter])
  return(toggle)
}

function useItemToggler (collection, getter, setter) {
  // collection of drive items
  return(
    useToggler(collection, (item) => getter(item.pathname),
                           (item, value) => setter(item.pathname, value))
  )
}

export function ToggleTrash (props) {
  // called with DriveItem collection for a pane
  const {drive, items} = props
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const toggle = useItemToggler(items, isTrashed, setTrashed)
  const checked = items && items[0] && isTrashed(items[0].pathname)
  console.log("TRASH:", checked, items, trashed)
  return (
    <button type="button" className="btn btn-light rounded-circle"
            disabled={!toggle}
            onClick={toggle || undefined}>
      <FontAwesomeIcon icon={checked ? faTrashRestore : faTrash}/>
    </button>
  )
}

export function ToggleFavorite (props) {
  const {drive, pane, items} = props
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const toggle = useItemToggler(items, isFavorite, setFavorite)
  const checked = items && items[0] && isFavorite(items[0].pathname)
  // console.log("FAVORITE TOGGLER:", pane, selection)
  return (
    <button type="button" className="btn btn-light rounded-circle"
          disabled={!toggle}
          onClick={toggle || undefined}>
     <FontAwesomeIcon className={[checked && "FavoriteMarker"].join(" ")} icon={faStar}/>
   </button>
  )
}

export function ExportOption (props) {
  const {drive, pane, children, className, action} = props
  const [selection, select, isSelected] = useSelection(drive, pane)
  return (
      <button type="button" className="btn btn-light rounded-circle"
              hidden={!action}
              onClick={action || undefined}>
       <FontAwesomeIcon icon={faDownload}/>
     </button>
  )
}

export default function ActionBar (props) {
  const {drive, pane, children, className} = props
  const [selection, select, isSelected] = useSelection(drive, pane)
  console.log("SELECTION:", selection, !isEmpty(selection))
  return (
    <div className={["ActionBar", className].join(" ")}>
      {!isEmpty(selection) && children}
    </div>
  )
}
