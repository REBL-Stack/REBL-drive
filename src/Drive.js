import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty } from 'lodash'
import filesize from 'filesize'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"
import config from "./config"

function FileRow ({dir, name, item, favorite, selected, onClick}) {
  const meta = useFileMeta(item)
  const {url, modified, size, deleteFile} = meta
  console.log("FILEMETA:", item, meta)
  const date = modified && new Date(modified)
  const dateOptions = {month: "short", day: "numeric", year: "numeric"}
  return (
    <tr className={["FileRow", selected && "table-active"].join(" ")} onClick={onClick}>
      <td>
        <span className="item-icon"><FontAwesomeIcon icon={faFile}/></span>
        <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
        {favorite && <FontAwesomeIcon icon={faStar}/>}
      </td>
      <td>{date && date.toLocaleDateString(undefined, dateOptions)}</td>
      <td>{size && filesize(size, {round: 1})}</td>
    </tr> )
}

function DirRow ({item, name, onOpen, selected, favorite, onClick}) {
  const {modified, size} = useDirectoryMeta(item.pathname)
  return (
    <tr className={["DirRow", selected && "active"].join(" ")} onClick={onClick}>
       <td className="text-left">
         <span className="item-icon"><FontAwesomeIcon icon={faFolder}/></span>
         <a href="#" onClick={() => onOpen({item: item})}>{name}</a>
       </td>
       <td>{modified}</td>
       <td>{size}</td>
    </tr>
  )
}

function ItemRow ({item, navigate, selected, onClick}) {
  const {path, name, isDirectory, pathname} = useDriveItem(item)
  const [favorite] = useFavorite(item)
  return (
    isDirectory ?
    <DirRow key={name} item={item} name={name} favorite={favorite} selected={selected} onClick={onClick} onOpen={navigate}/> :
    <FileRow key={name} selected={selected} item={item} favorite={favorite} selected={selected} onClick={onClick} dir={path} name={name} favorite={favorite}/>
  )
}

export function FilesTable ({drive, items, navigate, pane}) {
  // Show a table of drive items, subset of those in the drive
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const [selection, select, isSelected] = useSelection(drive, pane)
  return (
      <table className="table table-hover">
       <thead>
       <tr className="">
         <th>Name</th>
         <th>Modified</th>
         <th>Size</th>
       </tr>
       </thead>
       <tbody>
        {items && items.map((item) => {
          const selected = isSelected(item)
          const favorite = isFavorite(item)
          return (<ItemRow key={item.name} selected={selected} favorite={favorite} onClick={()=>select(item)} item={item} navigate={navigate}/>
          )})}
       </tbody>
      </table>)
}

const toggler = (selection, getter, setter) =>
     () => {
      const item = selection[0]
      const change = !getter(item)
      selection.forEach((item) => {
        setter(item, change)
      })
    }

export function ToggleTrash (props) {
  const {drive} = props
  const [selection, select, isSelected] = useSelection(drive)
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
  const {drive} = props
  const [selection, select, isSelected] = useSelection(drive)
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
  const {drive, pane, children} = props
  const [selection, select, isSelected] = useSelection(drive, pane)
  return (
    <div className="ActionBar">
      {!isEmpty(selection) && children}
    </div>
  )
}
export function Favorites ({drive}) {
  const [favorites, setFavorite, getFavorite] = useFavorites(drive)
  const items = useDriveItems(drive, favorites)
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


export default function Drive ({drive, navigate}) {
  const items = useDriveBranch(drive)
  const [current, setCurrent] = useCurrent(drive)
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const activeItems = items.filter((item) => !isTrashed(item.pathname))
  const title = drive.title || "Drive"
  return(
    <>
     <div className="pane-heading d-flex justify-content-between">
       <Breadcrumb title={title} trail={current} onClick={navigate}/>
       <ActionBar drive={drive} pane={null}>
         <ToggleTrash drive={drive}/>
         <ToggleFavorite drive={drive}/>
       </ActionBar>
     </div>
     <FilesTable drive={drive} items={activeItems} navigate={navigate}/>
    </>)
}
