import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'

import "./Sidebar.css"

export function Menu (props) {
  return (
    <ul className="list-unstyled components">
      {props.children}
    </ul>
  )
}

export function MenuItem (props) {
  return (
    <li>
      <NavLink to={props.target}>{props.children}</NavLink>
    </li>
  )
}

export default function Sidebar (props) {
  return (
    <nav className="Sidebar collapse navbar-collapse d-sm-block">
      <div id="sidebarContent" className="">
        {props.children}
      </div>
    </nav>
  )
}
