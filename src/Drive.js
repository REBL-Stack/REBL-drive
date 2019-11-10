import React, {useState, useCallback} from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty, drop, intersection, union, difference } from 'lodash'
import filesize from 'filesize'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"
import config from "./config"
import FilesTable from './Table'
import ActionBar, {ToggleTrash, ToggleFavorite, ExportOption} from './ActionBar'
import FileSaver, { saveAs } from 'file-saver'

const kind = config.kind

function useExportAction (items) {
  const {userSession} = useBlockstack()
  const exportAction = useCallback(items.length > 0 && (() => {
    const item = items[0]  // FIX: export multiple!
    console.log("ITEM:", item)
    if (item) {
      exportItem(userSession, item)
    }
  }), [items, userSession])
  return(exportAction)
}

function BasicActionBar (props) {
  const {className, drive, pane, items, exportAction} = props
  return(
    <ActionBar className={className} drive={drive} pane={pane}>
      {!isEmpty(items) &&
       <ExportOption drive={drive} pane={pane} action={exportAction}/>}
      {(kind != 'vault' && !isEmpty(items)) &&
       <ToggleTrash drive={drive} pane={pane} items={items}/>}
      {(kind != 'vault' && !isEmpty(items)) &&
       <ToggleFavorite drive={drive} pane={pane} items={items}/>}
    </ActionBar>
  )
}

export function Favorites ({drive, navigate}) {
  const pane = "favorites"
  const [favorites, setFavorite, getFavorite] = useFavorites(drive)
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const [selection, select, isSelected] = useSelection(drive, pane)
  const selectedItems = useDriveItems(drive, difference(selection, trashed))
  const items = useDriveItems(drive, favorites)
  const chosenItems = intersection(items,selectedItems)
  const exportAction = useExportAction(chosenItems)
  console.log("Favorities:", favorites, items, chosenItems)
  return (
    <>
      <div className="pane-heading d-flex justify-content-between">
        <h4>Favorites</h4>
        <BasicActionBar className="mr-4" drive={drive} pane={pane}
           items={chosenItems} exportAction={exportAction}/>
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
  const title = drive.title || "Drive"
  const pane = null
  const items = useDriveBranch(drive)
  const [current, setCurrent] = useCurrent(drive)
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const active = difference(items.map((item) => item.pathname), trashed)
  const activeItems = useDriveItems(drive, active)
  const [selection, select, isSelected] = useSelection(drive, pane)
  const selectedItems = useDriveItems(drive, difference(selection, trashed))
  const chosenItems = intersection(items,selectedItems)
  const exportAction = useExportAction(chosenItems)
  // console.log("DRIVE->", activeItems, selection, intersection(activeItems, selection))
  return(
    <div className="flex-grow-1">
     <div className="pane-heading d-flex justify-content-between">
       <Breadcrumb title={title} trail={current} onClick={navigate}/>
       <BasicActionBar className="mr-4" drive={drive} pane={pane}
          items={chosenItems} exportAction={exportAction}/>
     </div>
     <div className="h-100">
       <FilesTable drive={drive} items={activeItems} navigate={navigate} isFavorite={isFavorite}/>
     </div>
    </div>)
}
