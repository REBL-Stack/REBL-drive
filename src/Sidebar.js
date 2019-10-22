import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'

import css from "./Sidebar.css"

export default function Sidebar (props) {
  return (
    <nav id="sidebar" className="bg-light collapse navbar-collapse d-sm-block">
      <div id="sidebarContent" className="">
        <ul className="list-unstyled components">
          <li><NavLink to={"/drive"}>My Drive</NavLink></li>
          <li><NavLink to={"/favorites"}>Starred</NavLink></li>
          <li><NavLink to={"/shared"}>Shared</NavLink></li>
          <li><NavLink to={"/trash"}>Trash</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}
