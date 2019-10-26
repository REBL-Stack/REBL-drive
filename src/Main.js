import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import filesize from 'filesize'
import { useFiles, useFavorites, groupFiles, useFileMeta, useDirectoryMeta } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"

function FileRow ({dir, path}) {
  const {url, modified, size, deleteFile} = useFileMeta(dir + path)
  const date = modified && new Date(modified)
  const dateOptions = {month: "short", day: "numeric", year: "numeric"}
  return (
    <tr className="FileRow">
      <td>
        <span className="item-icon"><FontAwesomeIcon icon={faFile}/></span>
        <a href={url} target="_blank" rel="noopener noreferrer">{path}</a>
      </td>
      <td>{date && date.toLocaleDateString(undefined, dateOptions)}</td>
      <td>{size && filesize(size, {round: 1})}</td>
      <td><button onClick={deleteFile}>Delete</button></td>
    </tr> )
}

function DirRow ({dir, path, onOpen}) {
  const {modified, size} = useDirectoryMeta(dir + path)
  return (
    <tr className="DirRow">
       <td className="text-left">
         <span className="item-icon"><FontAwesomeIcon icon={faFolder}/></span>
         <a href="#" onClick={() => onOpen((dir + path).split("/"))}>{path}</a>
       </td>
       <td>{modified}</td>
       <td>{size}</td>
       <td></td>
    </tr>
  )
}

function FilesTable ({files, dirpath, setDir}) {
  const [favorites, toggleFavorite] = useFavorites()
  const items = files && groupFiles(files)
  return (
      <table className="table">
       <thead>
       <tr className="">
         <th>Name</th><th>Modified</th><th>Size</th><th>Actions</th>
       </tr>
       </thead>
       <tbody>
        {Array.from(items.entries()).map(([name, content]) =>
           content ?
           <DirRow key={name} dir={dirpath} path={name} onOpen={setDir}/> :
           <FileRow key={name} dir={dirpath} path={name}
              favorite={favorites && favorites.get(dirpath+name)}
              toggleFavorite={() => toggleFavorite(dirpath+name)}/> )}
       </tbody>
      </table>)
}

const dirpathDefault = "img/social-security-card".split("/")

function Files ( props ) {
  const [dir, setDir] = useState(dirpathDefault)
  const dirfiles = useFiles(dir)
  const dirpath = dir.join("/") + "/"
  return(
    <>
      <Breadcrumb title="Drive" items={dir} onClick={setDir}/>
      <FilesTable dirpath={dirpath} files={dirfiles} setDir={setDir}/>
    </>)
}

export default function Main (props) {
  const { person } = props
  return (
    <main className="bg-light">
      <Files/>
    </main>
  )
}
