import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import filesize from 'filesize'
import { useFiles, useFavorites, groupFiles, useFileMeta, useDirectoryMeta, useDirectoryItems } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"

function FileRow ({dir, name}) {
  const dirpath = dir.join("/") + "/"
  const path = dirpath + name
  const {url, modified, size, deleteFile} = useFileMeta(path)
  const date = modified && new Date(modified)
  const dateOptions = {month: "short", day: "numeric", year: "numeric"}
  return (
    <tr className="FileRow">
      <td>
        <span className="item-icon"><FontAwesomeIcon icon={faFile}/></span>
        <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
      </td>
      <td>{date && date.toLocaleDateString(undefined, dateOptions)}</td>
      <td>{size && filesize(size, {round: 1})}</td>
      <td><button onClick={deleteFile}>Delete</button></td>
    </tr> )
}

function DirRow ({dir, name, onOpen}) {
  const dirpath = dir.join("/") + "/"
  const {modified, size} = useDirectoryMeta(dirpath + name)
  return (
    <tr className="DirRow">
       <td className="text-left">
         <span className="item-icon"><FontAwesomeIcon icon={faFolder}/></span>
         <a href="#" onClick={() => onOpen((dirpath + name).split("/"))}>{name}</a>
       </td>
       <td>{modified}</td>
       <td>{size}</td>
       <td></td>
    </tr>
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
        {items && items.map(({path, name, isDirectory}) =>
           isDirectory ?
           <DirRow key={name} dir={path} name={name} onOpen={navigate}/> :
           <FileRow key={name} dir={path} name={name}/> )}
       </tbody>
      </table>)
}

export default function Drive ({drive, navigate}) {
  const dir = drive && drive.dir
  const items = useDirectoryItems(dir)
  return(
    <>
     <Breadcrumb title="Drive" trail={dir} onClick={navigate}/>
     <FilesTable items={items} navigate={navigate}/>
    </>)
}

export function Favorites (drive) {
  const [favorites, toggleFavorite] = useFavorites(drive)
  return (
    <>
      <nav>Favorites</nav>
      <FilesTable items={favorites}/>
    </>)
}

export function Shared () {
  return (
    <>
      <nav>Shared</nav>
    </>)
}

export function Trash () {
  return (
    <>
      <nav>Trash</nav>
    </>)
}
