const setConfigured = ({ rolUser, roles }: any) => {
  const { SUPER, ASISTENTE } = roles

  // Configuración base
  const config = {
    rolUser: rolUser,
    select: true,
    cuadricula: true,

    columns: [
      { column: "id" },
      { column: "name" },
      { column: "lastName" },
      { column: "email" },
      { column: "role" },
      { column: "cedula" },
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
