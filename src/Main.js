import React, {useState} from 'react'
import { useFilesList, useFileUrl, useFile, useFetch } from 'react-blockstack'
import { useFiles, useFavorites, groupFiles, useFileMeta } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"

function FileRow ({dir, path}) {
  const {url, modified, size, deleteFile} = useFileMeta(dir + path)
  return ( <tr><td><a href={url} target="_blank">{path}</a></td>
               <td>{modified}</td>
               <td>{size}</td>
               <td><button onClick={deleteFile}>Delete</button></td>
            </tr> )
}

function DirRow ({dir, path, onOpen}) {
  console.log("Dir:", dir)
  return (
    <tr>
       <td><a href="#" onClick={() => onOpen((dir + path).split("/"))}>{path}</a></td>
       <td></td>
       <td></td>
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
       <tr><th>Name</th><th>Modified</th><th>Size</th></tr>
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

const dirpathDefault = "img/social-security-card/"

function Files ( props ) {
  const [dir, setDir] = useState(dirpathDefault.split("/"))
  const dirpath = dir.join("/") + "/"
  const dirfiles = useFiles(dir)
  return(
    <>
      <Breadcrumb items={dirpath.split("/")} onClick={setDir}/>
      <FilesTable dirpath={dirpath} files={dirfiles} setDir={setDir}/>
    </>)
}

export default function Main (props) {
  const { person } = props
  return (
    <main>
      <Files/>
    </main>
  )
}
