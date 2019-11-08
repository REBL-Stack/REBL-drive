import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty, drop } from 'lodash'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import config from "./config"

export function toggler (selection, getter, setter) {
  return(
     () => {
      const item = selection[0]
      const change = !getter(item)
      console.log("TOGGLE:", item, change)
      selection.forEach((item) => {
        setter(item, change)
      })
    }
    )
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
