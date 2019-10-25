import React from 'react'

export default function Breadcrumb ({items, onClick}) {
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
