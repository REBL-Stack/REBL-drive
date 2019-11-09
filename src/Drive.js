import React, {useState, useCallback} from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty, drop } from 'lodash'
import filesize from 'filesize'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"
import config from "./config"
import FilesTable from './Table'
import ActionBar, {ToggleTrash, ToggleFavorite, ExportOption} from './ActionBar'
import FileSaver, { saveAs } from 'file-saver'

const kind = config.kind

export function Favorites ({drive, navigate}) {
  const [favorites, setFavorite, getFavorite] = useFavorites(drive)
  const items = useDriveItems(drive, favorites)
  console.log("Favorities:", favorites, items)
  return (
    <>
      <div className="pane-heading">
        <h4>Favorites</h4>
      </div>
      <FilesTable drive={drive} items={items} pane="favorites" navigate={navigate}/>
    </>)
}

export function Shared ({drive, navigate}) {
  const [items] = useShared(drive)
  return (
    <>
      <div className="pane-heading">
        <h4>Shared</h4>
      </div>
      <FilesTable drive={drive} items={items} pane="shared"  navigate={navigate}/>
    </>)
}

function useDrivePath(drive, location) {
  const trail = location && location.pathname && location.pathname.split('/')
  const path = trail && drop(trail, 2).map(decodeURIComponent)
  return(path || [])
}

function exportItem (userSession, driveItem) {
  const {pathname, name} = driveItem
  userSession.getFile(pathname)
  .then(content => {
    const blob =  (content && !(content instanceof Blob)) // always text?
                  ? new Blob([content], {type: "text/plain;charset=utf-8"})
                  : content
    saveAs(blob, name)
  })
  .catch(err => console.warn("Failed to export:", err))
}

export default function Drive ({drive, navigate}) {
  const pane = null
  const items = useDriveBranch(drive)
  const [current, setCurrent] = useCurrent(drive)
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const activeItems = items.filter((item) => !isTrashed(item.pathname))
  const title = drive.title || "Drive"
  const [selection, select, isSelected] = useSelection(drive, pane)
  const selectedItems = useDriveItems(drive, selection)
  const {userSession} = useBlockstack()
  const exportAction = useCallback(() => {
    const item = selectedItems[0]  // FIX: export multiple!
    console.log("ITEM:", item)
    if (item) {
      exportItem(userSession, item)
    }
  }, [selectedItems, userSession])
  return(
    <div className="flex-grow-1">
     <div className="pane-heading d-flex justify-content-between">
       <Breadcrumb title={title} trail={current} onClick={navigate}/>
       <ActionBar className="mr-4" drive={drive} pane={null}>
          <ExportOption drive={drive} action={exportAction}/>
         {(kind != 'vault') &&
          <ToggleTrash drive={drive}/>}
         {(kind != 'vault') &&
          <ToggleFavorite drive={drive}/>}
       </ActionBar>
     </div>
     <div className="h-100">
       <FilesTable drive={drive} items={activeItems} navigate={navigate} isFavorite={isFavorite}/>
     </div>
    </div>)
}
