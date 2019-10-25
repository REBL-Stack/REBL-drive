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
  <div className="wrapper">
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
