import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty, drop, intersection } from 'lodash'
import filesize from 'filesize'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import ActionBar from './ActionBar'
import FilesArea from './Table'

export default function Trash ({drive, navigate}) {
  const pane = "trash"
  const [trashed] = useTrash(drive)
  const items = useDriveItems(drive, trashed)
  const [selection, select, isSelected] = useSelection(drive, pane)
  const selectedItems = useDriveItems(drive, selection)
  const trashActionItems = intersection(items,selectedItems)
  return (
    <>
      <div className="pane-heading d-flex justify-content-between">
        <h4>Trash</h4>
        <ActionBar className="mr-4" drive={drive} pane={pane} items={trashActionItems}/>
      </div>
      {!isEmpty(items) &&
        <FilesArea drive={drive} items={items} pane="trash" navigate={navigate}/>}
    </>)
}
