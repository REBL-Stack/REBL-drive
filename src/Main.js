import React, {useState} from 'react';
import { useFilesList, useFileUrl, useFile, useFetch } from 'react-blockstack'

function renameFile (userSession, path, rename) {
  // skip encryption here for speed?
  // Migrate to react-blockstack but as part of hook? and update filelist?
  userSession.getFile(path)
  .then( content => userSession.putFile(rename, content)
                    .then(() => userSession.deleteFile(path) ))
}

function useFavorites () {
  const [value, setValue] = useFile(".favorites")
  const favorites = value && JSON.parse(value)
  const toggleFavorite = (path) => {
    const entry = {}
    entry[path] = !favorites.get(path)
    setValue(JSON.stringify(Object.assign({}, favorites, entry)))
  }
  return [favorites, toggleFavorite]
}

function Breadcrumb ({items, onClick}) {
  return(
    <nav aria-label="breadcrumb">
      <ul className="breadcrumb">
        {[...Array(items.length).keys()].map( n =>
          <li className="breadcrumb-item">
            {(n < items.length - 2) ? <a href="#" onClick={() => onClick(items.slice(0, n+1))}>{items[n]}</a> : items[n]}
          </li>)}
      </ul>
    </nav>
  )
}

function FileRow ({dir, path}) {
  console.log("FileRow:", path)
  const pathname = dir + path
  const [content, setContent] = useFile(pathname)
  const url = useFileUrl(pathname)
  const init = {method: "GET", headers: new Headers({"User-Agent": "curl/7.43.0", "Accept":"*/*"})}
  const response = useFetch(pathname, init)
  console.log("Response:", response, response && response.headers)
  return ( <tr><td><a href={url} target="_blank">{path}</a></td>
               <td>{response && response.headers.get("Last-Modified")}</td>
               <td>{response && response.headers.get("Content-Length")}</td>
               <td><button onClick={() => setContent(null)}>Delete</button></td>
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

function groupReducer (obj, path) {
  if (path.includes("/")) {
    const name = path.split("/")[0]
    // obj[path] = [...(obj.get(path) || []), path]
    obj.set(name, [...(obj.get(name) || []), path])
  } else {
    obj.set(path, null)
  }
  return (obj)
}

function groupFiles (files) {
  return(files.reduce(groupReducer, new Map([])))
}

function FilesTable ({files, dirpath, setDir}) {
  const [favorites, toggleFavorite] = useFavorites()
  const items = files && groupFiles(files)
  console.log("Items:", items)
  console.log("Array:", Array.from(items.entries()))
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
  const [files, complete] = useFilesList()
  const [dir, setDir] = useState(dirpathDefault.split("/"))
  const dirpath = dir.join("/") + "/"
  const dirfiles = files.filter(path => path.startsWith(dirpath))
                        .map(path => path.substr(dirpath.length))
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
