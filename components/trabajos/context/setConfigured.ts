const setConfigured = ({ rolUser, roles }: any) => {
  const { SUPER, EDITOR } = roles

  // Configuración base
  const config = {
    rolUser: rolUser,
    select: false,
    cuadricula: false,

    columns: [
      { column: "id" },
      { column: "titulo" },
      { column: "autor" },
      { column: "lineaDeInvestigacion" },
      { column: "estado" },
      { column: "periodoAcademico" },
    ],
    rowActions: [
      { name: "changeEstado", type: "select" },
      { name: "doc", type: "btn" },
      { name: "edit", type: "btn" },
      { name: "view", type: "btn" },
    ],
    headerFilter: ["periodoAcademico", "lineaDeInvestigacion"],
    headerActions: [],
    footerActions: [],
  }

  switch (rolUser) {
    case SUPER:
      // Super tiene acceso completo
      break
    case EDITOR:
      // Editor tiene acceso limitado
      break
  }

  config.columns.push({ column: "acciones" })

  return config
}

export default setConfigured
