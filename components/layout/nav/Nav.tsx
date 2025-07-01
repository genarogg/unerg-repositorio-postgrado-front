'use client';
import React from 'react'
import { A } from "../../nano";
import { Icon } from "../../ux";

interface MenuItem {
  href: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void; // Nueva función opcional por elemento
}

interface NavProps {
  className?: string;
  menuItems: MenuItem[];
  onClick?: () => void; // Función global opcional
}

/* 
como usar

const menuItems = [
  { href: "/", label: "Inicio", icon: <TiHome />, onClick: () => alert("Inicio") },
  { href: "#servicios", label: "Servicios", icon: <FaLightbulb />, onClick: () => alert("Servicios") },
  // ...
];
*/

const Nav: React.FC<NavProps> = ({
  menuItems,
  className = "",
  onClick
}) => {
  return (
    <div
      className={`container-nav ${className} ${menuItems[0]?.icon ? "" : "sin-iconos"}`}
    >
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                if (item.onClick) item.onClick();
                if (onClick) onClick();
              }}
            >
              <A href={item.href} >
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