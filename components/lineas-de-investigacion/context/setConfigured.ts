const setConfigured = ({ rolUser, roles }: any) => {
  const { EDITOR, SUPER } = roles

  // Configuración base
  const config = {
    rolUser: rolUser,
    select: false,
    cuadricula: false,

    columns: [{ column: "id" }, { column: "nombre" }, { column: "estado" }],
    rowActions: [
      { name: "changeEstado", type: "select" },
      { name: "edit", type: "btn" },
    ],
    headerFilter: [],
    headerActions: [],
    footerActions: [],
  }

  // Agregar columna de acciones al final
  config.columns.push({ column: "acciones" })

  return config
}

export default setConfigured
