import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty, drop } from 'lodash'
import filesize from 'filesize'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import FilesTable from './Table'

export default function Trash ({drive, navigate}) {
  const [trashed] = useTrash(drive)
  const items = useDriveItems(drive, trashed)
  return (
    <>
      <div className="pane-heading">
        <h4>Trash</h4>
      </div>
      <FilesTable drive={drive} items={items} pane="trash" navigate={navigate}/>
    </>)
}
