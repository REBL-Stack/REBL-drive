import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'

import "./Sidebar.css"

export function Menu (props) {
  return (
    <ul className="list-unstyled list-group components">
      {props.children}
    </ul>
  )
}

export function MenuItem (props) {
  // disabled if target is faslsy
  return (
    <NavLink className={["list-group-item", !props.target && "disabled"].join(" ")}
             to={ props.target || "/disabled"}>
      {props.children}
    </NavLink>
  )
}


/*
export function MenuItem (props) {
  return (
    <li className="list-group-item">
      <NavLink to={props.target}>{props.children}</NavLink>
    </li>
  )
}
*/

export default function Sidebar (props) {
  return (
  <div className={["wrapper", props.className].join(" ")}>
    <nav className="Sidebar collapse navbar-collapse d-sm-block">
      <div id="sidebarContent" className="">
        {props.children}
      </div>
    </nav>
  </div>
  )
}

export function Navbar (props) {
  return (
    <div className={["Navbar navbar", props.className].join(" ")}>
      {props.children}
    </div>
  )
}

export function Row (props) {
  return (
    <div className={["Row row", props.className].join(" ")}>
      {props.children}
    </div>
  )
}

export function Col (props) {
  return (
    <div className={["Col col", props.className].join(" ")}>
      {props.children}
    </div>
  )
}

export function ColAuto (props) {
  return (
    <div className={["ColAuto col-auto", props.className].join(" ")}>
      {props.children}
    </div>
  )
}
