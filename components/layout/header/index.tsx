import React from "react";
import "../sass/header.scss";

import BtnFreya from "../../ux/btns/btn-freya";

import Title from "./Title";
import SideBar from "./sidebar";

import Nav from "../nav/Nav";
import { useAuth } from "../../../context/AuthContext";

interface HeaderProps {
    children?: React.ReactNode;
    where?: string;
}

const Header: React.FC<HeaderProps> = () => {

    const { state: { isAuthenticated } } = useAuth();

    const btnRemove = () => {
        console.log("btnRemove");
        const btn = document.getElementById("btn-hamburguer-loki");
        btn?.classList.remove("active");
    }

    const toggleAside = () => {
        const container = document.getElementById("container-aside");
        container?.classList.toggle("sidebar-header");
    }

    const menuItems = [
        { href: "/", label: "Inicio" },
    ];

    console.log("isAuthenticated", isAuthenticated);

    if (isAuthenticated) {
        menuItems.push(

            { href: "/dashboard/trabajos", label: "trabajos" },
            { href: "/dashboard/lineas-de-investigacion", label: "lineas" },

            { href: "/dashboard/usuarios", label: "usuarios" },
                { href: "/reportes", label: "reportes" },
            { href: "/", label: "Salir" }
        );
    }
    else {
        menuItems.push(

            { href: "/documentos", label: "documentos" },
        
            { href: "/login", label: "login" },
        );
    }

    return (
        <header className="header-container">
            <div className="desktop-header">
                <Title />
                <Nav menuItems={menuItems} />
            </div>

            <div className="movile-header">
                <nav>
                    <ul className="elements">
                        <li>
                            <BtnFreya onClick={() => { toggleAside() }} />
                        </li>
                        <li>
                            <Title />
                        </li>
                    </ul>
                    <SideBar
                        logoutfn={() => { btnRemove(); toggleAside(); }}
                    >
                        <Nav
                            menuItems={menuItems}
                            onClick={() => { btnRemove(); toggleAside(); }}
                        />
                    </SideBar>
                </nav>
            </div>

        </header>
    );
};

export default Header;
