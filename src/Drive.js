import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar } from '@fortawesome/free-solid-svg-icons'
import filesize from 'filesize'
import { useFiles, useFavorites, useShared, useTrash, groupFiles, useFileMeta, useDirectoryMeta, useDriveItems } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"

function FileRow ({dir, name, pathname, favorite}) {
  const {url, modified, size, deleteFile} = useFileMeta(pathname)
  const date = modified && new Date(modified)
  const dateOptions = {month: "short", day: "numeric", year: "numeric"}
  return (
    <tr className="FileRow">
      <td>
        <span className="item-icon"><FontAwesomeIcon icon={faFile}/></span>
        <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
        {favorite && <FontAwesomeIcon icon={faStar}/>}
      </td>
      <td>{date && date.toLocaleDateString(undefined, dateOptions)}</td>
      <td>{size && filesize(size, {round: 1})}</td>
      <td><button onClick={deleteFile}>Delete</button></td>
    </tr> )
}

function DirRow ({dir, name, onOpen}) {
  const fullpath = dir.join("/") + "/" + name
  const {modified, size} = useDirectoryMeta(fullpath)
  return (
    <tr className="DirRow">
       <td className="text-left">
         <span className="item-icon"><FontAwesomeIcon icon={faFolder}/></span>
         <a href="#" onClick={() => onOpen(fullpath.split("/"))}>{name}</a>
       </td>
       <td>{modified}</td>
       <td>{size}</td>
       <td></td>
    </tr>
  )
}

function ItemRow ({item, navigate}) {
  const {path, name, isDirectory, pathname, favorite} = item
  console.log("ITEM:", item)
  return (
    isDirectory ?
    <DirRow key={name} dir={path} name={name} onOpen={navigate}/> :
    <FileRow key={name} pathname={pathname} dir={path} name={name} favorite={favorite}/>
  )
}

export function FilesTable ({items, navigate}) {
  return (
      <table className="table">
       <thead>
       <tr className="">
         <th>Name</th><th>Modified</th><th>Size</th><th>Actions</th>
       </tr>
       </thead>
       <tbody>
        {items && items.map((item) => <ItemRow item={item} navigate={navigate}/>)}
       </tbody>
      </table>)
}

export default function Drive ({drive, navigate}) {
  const items = useDriveItems(drive)
  return(
    <>
     <Breadcrumb title="Drive" trail={drive.dir} onClick={navigate}/>
     <FilesTable items={items} navigate={navigate}/>
    </>)
}

export function Favorites ({drive}) {
  const [items, toggleFavorite] = useFavorites(drive)
  return (
    <>
      <nav>Favorites</nav>
      <FilesTable items={items}/>
    </>)
}

export function Shared ({drive}) {
  const [items] = useShared(drive)
  return (
    <>
      <nav>Shared</nav>
      <FilesTable items={items}/>
    </>)
}

export function Trash ({drive}) {
  const [items] = useTrash(drive)
  return (
    <>
      <nav>Trash</nav>
      <FilesTable items={items}/>
    </>)
}
