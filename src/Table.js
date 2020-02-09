import React, { useState, useCallback} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty } from 'lodash'
import filesize from 'filesize'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"
import config from "./config"

function FavoriteMarker ({hidden}) {
  return <FontAwesomeIcon className="FavoriteMarker" hidden={hidden} icon={faStar}/>
}

function FileRow ({dir, name, item, favorite, selected, onClick}) {
  const meta = useFileMeta(item)
  const {url, modified, size, deleteFile} = meta
  // console.log("FILEMETA:", item, meta)
  const date = modified && new Date(modified)
  const dateOptions = {month: "short", day: "numeric", year: "numeric"}
  return (
    <tr className={["FileRow", selected ? "table-active" : null].join(" ")}
        onClick={onClick}>
      <td className="">
        <span className="item-icon">
          <FontAwesomeIcon className="text-secondary" icon={faFile}/>
        </span>
        <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
        <FavoriteMarker hidden={!favorite}/>
      </td>
      <td style={{width:"1px", whiteSpace:"nowrap"}}>
        {date && date.toLocaleDateString(undefined, dateOptions)}
      </td>
      <td style={{width:"1px", whiteSpace:"nowrap"}}>
        {size && filesize(size, {round: 1})}
      </td>
    </tr> )
}

function DirRow ({item, name, onOpen, selected, favorite, onClick}) {
  const {modified, size} = useDirectoryMeta(item)
  console.log("SELDIR:", name, selected, favorite)
  return (
    <tr className={["DirRow", selected && "table-active"].join(" ")} onClick={onClick}>
       <td className="text-left">
         <span className="item-icon">
           <FontAwesomeIcon className="text-secondary" icon={faFolder}/>
         </span>
         <a href="#" onClick={onOpen && (() => onOpen({item: item}))}>{name}</a>
         <FavoriteMarker hidden={!favorite}/>
       </td>
       <td>{modified}</td>
       <td>{size}</td>
    </tr>
  )
}

function ItemRow ({item, navigate, selected, favorite, onClick}) {
  const {path, name, isDirectory, pathname} = useDriveItem(item)
  return (
    isDirectory ?
    <DirRow key={name} item={item} name={name} favorite={favorite} selected={selected} onClick={onClick} onOpen={navigate}/> :
    <FileRow key={name} selected={selected} item={item} favorite={favorite} selected={selected} onClick={onClick} dir={path} name={name} favorite={favorite}/>
  )
}

export function FilesTable ({drive, pane, items, navigate, isFavorite}) {
  // Show a table of drive items, subset of those in the drive
  const [selection, select, isSelected] = useSelection(drive, pane)
  const toggle = useCallback(function (pickedItem, allowMultiple) {
    console.log("TOGGLE:", pickedItem)
    if (!allowMultiple) {
      items.forEach((item) => {
        if (item != pickedItem) {
          select(item, false)
        }
      })}
    select(pickedItem, !isSelected(pickedItem))
  }, [selection, select, isSelected])
  return (
      <table className="table table-hover">
       <thead>
       <tr className="d-none">
         <th>Name</th>
         <th>Modified</th>
         <th>Size</th>
       </tr>
       </thead>
       <tbody>
        {items && items.map((item) => {
          const selected = isSelected(item)
          const favorite = isFavorite && isFavorite(item.pathname)
          //console.log("FILEITEM:", item, favorite, items)
          return (<ItemRow key={item.name} selected={selected} favorite={favorite} onClick={(e)=>{toggle(item); e.stopPropagation()}} item={item} navigate={navigate}/>
          )})}
       </tbody>
      </table>)
}

export default function FilesArea (props) {
  // A FilesTable with a div wrapper to fill display and unselect when clicking outside table
  const {drive, pane, items} = props
  const [selection, select, isSelected] = useSelection(drive, pane)
  const clearSelection = useCallback(() => {
      console.log("CLEAR:", selection)
      items.forEach((item) => {
        select(item, false)
      })
    }, [items, select])
  return (
    <div className="FilesArea w-100 h-100" onClick={clearSelection}>
      <FilesTable {...props}/>
    </div>
  )

}
