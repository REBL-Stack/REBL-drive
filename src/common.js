import React, {useState, useEffect} from 'react'
import { useBlockstack } from 'react-blockstack'

export function proxyUrl (url) {
  // url can be string or URL
  return(url && url.toString().replace(/https?:\/\//, "/proxy/"))
}

// soon to be in react-blockstack...
export function usePerson() {
  // Also see useProfile in react-blockstack
  // TODO: memoize avatar url so it is only fetched once
  const { userData, person } = useBlockstack()
  const { username } = userData || {}
  const [avatarUrl, setAvatar] = useState(null)
  useEffect(() => {
    const avatarUrl = (person && person.avatarUrl && person.avatarUrl())
    // const icon = avatarUrl && proxyUrl(avatarUrl)
    if (avatarUrl) {
      fetch(avatarUrl, {method: "GET", mode: 'cors'})
        .then((response) => {
          response.blob()
          .then((blob) => URL.createObjectURL(blob))
          .then((url) => setAvatar(url))
        })
        .catch((err) => console.warn("Avatar Failed fetching url:", err))
      }
  }, [person])
  // need better replace here!
  const username2 = username && username.replace(/.id.blockstack$/, "")
  return { avatarUrl , username: username2 }
}
