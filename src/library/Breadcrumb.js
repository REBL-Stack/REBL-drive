import React from 'react'

export default function Breadcrumb ({trail, onClick, title}) {
  return(
    <nav aria-label="breadcrumb">
      <ul className="breadcrumb">
        {title &&
         <li className="breadcrumb-item breadcrumb-title">
           <a href="#" onClick={ () => onClick([])}>{title}</a>
         </li>}
        {[...Array(trail.length).keys()].map( n =>
          <li className="breadcrumb-item">
            {(n < trail.length - 1) ? <a href="#" onClick={() => onClick({dir: trail.slice(0, n+1)})}>{trail[n]}</a> : trail[n]}
          </li>)}
      </ul>
    </nav>
  )
}
