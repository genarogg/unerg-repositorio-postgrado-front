'use client';
import React from 'react'
import { A } from "../../nano";
import { Icon } from "../../ux";

// Definición de tipo flexible que permite cualquier combinación
interface MenuItem {
  href: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  visible?: boolean;
  role?: string | string[];
}

interface NavProps {
  className?: string;
  menuItems: MenuItem[];
  onClick?: () => void; // Función global opcional
  userRole?: string; // Rol del usuario actual
}

/* 
Ejemplo de uso:

const menuItems = [
  { href: "/", label: "Inicio", icon: <TiHome /> },
  { href: "/dashboard/trabajos", label: "Trabajos", role: "admin" },
  { href: "/dashboard/usuarios", label: "Usuarios", role: ["admin", "moderator"] },
  { href: "/", label: "Salir", onClick: () => borrarToken() },
  { href: "/login", label: "Login", visible: !isAuthenticated },
];

const borrarToken = () => {
  localStorage.removeItem("auth_token");
}
*/

const Nav: React.FC<NavProps> = ({
  menuItems,
  className = "",
  onClick,
  userRole
}) => {
  
  // Función para verificar si el usuario tiene el rol requerido
  const hasRequiredRole = (item: MenuItem): boolean => {
    if (!item.role) return true; // Si no hay rol requerido, mostrar
    
    if (!userRole) return false; // Si no hay rol de usuario, no mostrar
    
    if (Array.isArray(item.role)) {
      return item.role.includes(userRole);
    }
    
    return item.role === userRole;
  };

  // Función para verificar si el elemento debe ser visible
  const isItemVisible = (item: MenuItem): boolean => {
    // Si tiene propiedad visible definida, usar esa
    if (item.visible !== undefined) {
      return item.visible;
    }
    
    // Si no, verificar por rol
    return hasRequiredRole(item);
  };

  // Filtrar elementos visibles
  const visibleItems = menuItems.filter(isItemVisible);

  // Verificar si hay iconos para aplicar la clase correspondiente
  const hasIcons = visibleItems.some(item => item.icon);

  return (
    <div
      className={`container-nav ${className} ${hasIcons ? "" : "sin-iconos"}`}
    >
      <nav>
        <ul>
          {visibleItems.map((item, index) => (
            <li
              key={`${item.href}-${index}`} // Mejor key para evitar problemas con índices
              onClick={() => {
                if (item.onClick) item.onClick();
                if (onClick) onClick();
              }}
            >
              <A href={item.href}>
                {item.icon && (
                  <div className="container-icono">
                    <Icon icon={item.icon} />
                  </div>
                )}

                {item.label && (
                  <label>
                    {item.label}
                  </label>
                )}
              </A>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Nav;