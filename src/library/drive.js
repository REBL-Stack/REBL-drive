import { useFilesList, useFileUrl, useFile, useFetch } from 'react-blockstack'

export function useFiles (dir) {
  // Files in a specific subpath
  const [files, complete] = useFilesList()
  const dirpath = dir.join("/") + "/"
  const dirfiles = files.filter(path => path.startsWith(dirpath))
                        .map(path => path.substr(dirpath.length))
  return(dirfiles)
}


export function useFavorites () {
  const [value, setValue] = useFile(".favorites")
  const favorites = value && JSON.parse(value)
  const toggleFavorite = (path) => {
    const entry = {}
    entry[path] = !favorites.get(path)
    setValue(JSON.stringify(Object.assign({}, favorites, entry)))
  }
  return [favorites, toggleFavorite]
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

export function groupFiles (files) {
  return(files.reduce(groupReducer, new Map([])))
}

export function renameFile (userSession, path, rename) {
  // skip encryption here for speed?
  // Migrate to react-blockstack but as part of hook? and update filelist?
  userSession.getFile(path)
  .then( content => userSession.putFile(rename, content)
                    .then(() => userSession.deleteFile(path) ))
}

export function useFileMeta (pathname) {
  // Properties returned:
  // modified: A datestamp string in a format parseable by Date()
  const [content, setContent] = useFile(pathname)
  const url = useFileUrl(pathname)
  const init = {method: "GET", headers: new Headers({"User-Agent": "curl/7.43.0", "Accept":"*/*"})}
  const response = useFetch(pathname, init)
  console.log("Response:", response, response && response.headers)
  const modified = response && response.headers.get("Last-Modified")
  const size = response && response.headers.get("Content-Length")
  const deleteFile = () => setContent(null)
  return({fileUrl: url, modified, size, deleteFile})
}

export function useDirectoryMeta (path) {
  const modified = ""
  const size = ""
  return ({modified, size})
}
