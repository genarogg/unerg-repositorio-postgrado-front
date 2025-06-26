"use client"
import type React from "react"
import Search from "./Search"
import AggEditar from "../../../components/modals/AggEditar"

type HeaderDownProps = {}

const HeaderDown: React.FC<HeaderDownProps> = () => {
  return (
    <div className="table-header-controls-section">
      <div className="box-left">
        <Search />
      </div>
      <div className="box-right">
        <div className="modal-button-wrapper">
          <AggEditar />
        </div>
      </div>
    </div>
  )
}

export default HeaderDown
