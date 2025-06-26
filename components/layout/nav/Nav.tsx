'use client';
import React from 'react'
import { A } from "../../nano";
import { Icon } from "../../ux";

interface NavProps {
  className?: string;
  menuItems: {
    href: string;
    label?: string;
    icon?: React.ReactNode;
  }[];
  onClick?: () => void;
}

/* 
como usar

// Definir los elementos del header

const menuItems = [
  { href: "/", label: "Inicio", icon: <TiHome /> },
  { href: "#servicios", label: "Servicios", icon: <FaLightbulb /> },
  ...
];
*/

const Nav: React.FC<NavProps> = ({
  menuItems,
  className = "",
  onClick
}) => {
  return (
    <div
      className={`container-nav ${className} ${menuItems[0].icon ? "" : "sin-iconos"}`}
    >
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li
              onClick={() => { onClick && onClick() }}
              key={index}>
              <A href={item.href} >
                {item.icon && (
                  <div className="container-icono">
                    <Icon icon={item.icon} />
                  </div>
                )}

                {item.label && (
                  <label htmlFor="">
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
