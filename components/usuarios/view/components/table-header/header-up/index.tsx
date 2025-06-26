"use client"
import type React from "react"

import SelectRol from "./SelectRol"

import "./css/header-up.css"

type HeaderUpProps = {}

const HeaderUp: React.FC<HeaderUpProps> = () => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <>
      <div className="table-header-title-section">
        <div className="title-and-role-container">
          <div className="box-left">
            <h2 className="table-title">Usuarios</h2>
          </div>

          <div className="box-right">{isDevelopment && <SelectRol />}</div>
        </div>
      </div>
      <div className="table-header-divider"></div>
    </>
  )
}

export default HeaderUp
