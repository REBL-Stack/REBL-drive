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
import ActionBar, {ToggleTrash, ToggleFavorite, DownloadAction} from './ActionBar'


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
          {false && <DownloadAction drive={drive}/>}
         <ToggleTrash drive={drive}/>
         <ToggleFavorite drive={drive}/>
       </ActionBar>
     </div>
     <FilesTable drive={drive} items={activeItems} navigate={navigate} isFavorite={isFavorite}/>
    </>)
}
