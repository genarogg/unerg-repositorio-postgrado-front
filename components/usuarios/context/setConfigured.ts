const setConfigured = ({ rolUser, roles }: any) => {
  const { SUPER, ASISTENTE } = roles

  // Configuración base
  const config = {
    rolUser: rolUser,
    select: false,
    cuadricula: false,

    columns: [
      { column: "id" },
      { column: "name" },
      { column: "lastName" },
      { column: "email" },
      { column: "cedula" },
      { column: "role" },
      { column: "estado" },
      { column: "acciones" },
    ],
    rowActions: [
      { name: "changePassword", type: "btn" },
      { name: "edit", type: "btn" },
    ],
    headerFilter: [],
    headerActions: [],
    footerActions: [],
  }

  // Ambos roles tienen las mismas acciones
  return config
}

export default setConfigured
