import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faStar, faShare, faTrash } from '@fortawesome/free-solid-svg-icons'

import "./Sidebar.css"

export default function Sidebar (props) {
  return (
    <nav id="sidebar" className="bg-light collapse navbar-collapse d-sm-block">
      <div id="sidebarContent" className="">
        <ul className="list-unstyled components">
          <li><NavLink to={"/drive"}>
                <FontAwesomeIcon icon={faHdd}/> My Drive
              </NavLink>
          </li>
          <li><NavLink to={"/favorites"}>
                 <FontAwesomeIcon icon={faStar}/>Favorites
               </NavLink>
          </li>
          <li><NavLink to={"/shared"}>
                 <FontAwesomeIcon icon={faShare}/>Shared
               </NavLink>
           </li>
          <li><NavLink to={"/trash"}>
                <FontAwesomeIcon icon={faTrash}/>Trash
              </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
