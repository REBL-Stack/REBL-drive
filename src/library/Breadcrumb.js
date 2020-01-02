import React from 'react'

export default function Breadcrumb ({trail, onClick, title}) {
  const goTop = (trail.length > 0) && (() => onClick({path: []}))
  return(
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {title &&
         <li key="0" className="breadcrumb-item breadcrumb-title">
           { goTop ? <a href="#" onClick={ goTop }>{title}</a> : title}
         </li>}
        {[...Array(trail.length).keys()].map( n =>
          <li key={n+1} className="breadcrumb-item">
            {(n < trail.length - 1) ?
              <a href="#" onClick={() => onClick({path: trail.slice(0, n+1)})}>{trail[n]}</a>
              : trail[n]}
          </li>)}
      </ol>
    </nav>
  )
}
