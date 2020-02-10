import React, {useState, useCallback} from 'react'
import { useBlockstack } from 'react-blockstack'
import { useShared } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"
import config from "./config"
import FilesTable from './Table'
import ActionBar from './ActionBar'
import { useExportAction } from './action'

export default function SharedPane ({drive, navigate}) {
  const pane = "shared"
  const [items] = useShared(drive)
  return (
    <>
      <div className="pane-heading d-flex justify-content-between">
        <Breadcrumb title="Shared" trail={[]} onClick={navigate}/>
        <ActionBar className="mr-4" drive={drive} pane={pane}
           items={items}/>
      </div>
      <FilesTable drive={drive} items={items} pane={pane}  navigate={navigate}/>
    </>)
}
