import React from 'react'

export default function Breadcrumb ({items, onClick, title}) {
  return(
    <nav aria-label="breadcrumb">
      <ul className="breadcrumb">
        {title &&
         <li className="breadcrumb-item breadcrumb-title">
           <a href="#" onClick={ () => onClick([])}>{title}</a>
         </li>}
        {[...Array(items.length).keys()].map( n =>
          <li className="breadcrumb-item">
            {(n < items.length - 1) ? <a href="#" onClick={() => onClick(items.slice(0, n+1))}>{items[n]}</a> : items[n]}
          </li>)}
      </ul>
    </nav>
  )
}
