import React, {useState, useCallback} from 'react'
import { useBlockstack } from 'react-blockstack'
import FileSaver, { saveAs } from 'file-saver'

function exportItem (userSession, driveItem) {
  const {pathname, name} = driveItem
  userSession.getFile(pathname)
  .then(content => {
    const blob =  (content && !(content instanceof Blob)) // always text?
                  ? new Blob([content], {type: "text/plain;charset=utf-8"})
                  : content
    saveAs(blob, name)
  })
  .catch(err => console.warn("Failed to export:", err))
}

export function useExportAction (items) {
  const {userSession} = useBlockstack()
  const exportAction = useCallback(items.length > 0 && (() => {
    const item = items[0]  // FIX: export multiple!
    console.log("ITEM:", item)
    if (item) {
      exportItem(userSession, item)
    }
  }), [items, userSession])
  return(exportAction)
}
