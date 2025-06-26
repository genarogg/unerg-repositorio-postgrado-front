"use client"

import React from "react"

import "./css/index.css"

import HeaderUp from "./header-up"
import HeaderDown from "./header-down"


const TableHeader: React.FC = () => {
  return (
    <div className="table-header-container">
      <HeaderUp />
      <HeaderDown />
    </div>
  )
}

export default TableHeader
