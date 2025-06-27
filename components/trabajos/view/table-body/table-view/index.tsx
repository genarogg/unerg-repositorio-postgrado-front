"use client"

import { Check, Minus } from "lucide-react"

import ActionRow from "../../components/actions/ActionRow"

import { Badge } from "../../../../ux"
import "./tablet-view.css"

import { useGlobal, useGlobalStatic } from "../../../context/Global"

export default function TableView() {
  const {
    data,
    getSelectAllState,
    toggleAllSelect,
    isItemSelected,
    toggleSelectItem,
  } = useGlobal()

  const {
    configured,
    badges,
  } = useGlobalStatic()

  const { select, cuadricula, columns } = configured
  const { estados, roles } = badges

  // Función auxiliar para verificar si un valor es un rol válido
  const isValidRole = (value: any): value is keyof typeof roles => {
    return typeof value === 'string' && value in roles
  }

  // Función auxiliar para verificar si un valor es un estado válido
  const isValidStatus = (value: any): value is keyof typeof estados => {
    return typeof value === 'string' && value in estados
  }

  return (
    <>
      <div className="table-container">
        <table
          className={`
            data-table 
            ${select ? "" : "no-select"} 
            ${cuadricula ? "with-grid" : ""}`
          }>
          <thead>
            <tr>
              {select && (
                <th className="select-column">
                  <button
                    className={`select-btn master-select ${getSelectAllState()}`}
                    onClick={() => { toggleAllSelect() }}
                    title="Seleccionar todos"
                  >
                    {getSelectAllState() === "all" && <Check size={14} />}
                    {getSelectAllState() === "some" && <Minus size={14} />}
                  </button>
                </th>
              )}
              {columns
                .map((column: any, index: any) => (
                  <th key={index}>
                    {column.column}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody style={{ minHeight: "320px", position: "relative" }}>
            {data.items.map((item: any, index: any) => (
              <tr key={item.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                {select && (
                  <td className="select-column">
                    <button
                      className={`select-btn ${isItemSelected(item) ? "selected" : ""}`}
                      onClick={() => toggleSelectItem(item)}
                      title="Seleccionar elemento"
                    >
                      {isItemSelected(item) && <Check size={14} />}
                    </button>
                  </td>
                )}

                {columns.map((column: any, Index: any) => {
                  const fieldKey = column.key || column.column;
                  const value = item[fieldKey];

                  // Renderizar badge para 'rol'
                  if (column.column === "rol" && isValidRole(value)) {
                    return (
                      <td key={Index}>
                        <Badge customColor={roles[value].color} width="110px">
                          {roles[value].name}
                        </Badge>
                      </td>
                    );
                  }

                  // Renderizar badge para 'estado'
                  if (column.column === "estado" && isValidStatus(value)) {
                    return (
                      <td key={Index}>
                        <Badge customColor={estados[value].color} width="110px">
                          {estados[value].name}
                        </Badge>
                      </td>
                    );
                  }

                  return (
                    <td key={Index}>
                      {column.column === 'acciones' ? (
                        <ActionRow item={item} />
                      ) : (
                        value || ''
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
