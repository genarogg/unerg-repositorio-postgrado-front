import React from "react";
import "../sass/header.scss";

import BtnFreya from "../../ux/btns/btn-freya";

import Title from "./Title";
import SideBar from "./sidebar";

import Nav from "../nav";
import { useAuth } from "../../../context/AuthContext";

interface HeaderProps {
    children?: React.ReactNode;
    where?: string;
}

const Header: React.FC<HeaderProps> = () => {

    const { state: { isAuthenticated, rol } } = useAuth();

    const btnRemove = () => {
        console.log("btnRemove");
        const btn = document.getElementById("btn-hamburguer-loki");
        btn?.classList.remove("active");
    }

    const toggleAside = () => {
        const container = document.getElementById("container-aside");
        container?.classList.toggle("sidebar-header");
    }


    const borrarToken = () => {
        localStorage.removeItem("auth_token");
        window.location.href = "/";
    }

    const menuItems = [
        // Inicio - siempre visible
        {
            href: "/",
            label: "Inicio",

        },
        {
            href: "/documentos",
            label: "documentos"
        },
        {
            href: "/login",
            label: "login"
            , visible: !isAuthenticated
        },
        {
            href: "/dashboard/trabajos",
            label: "trabajos",
            role: ["SUPER", "EDITOR"]
        },
        {
            href: "/dashboard/lineas-de-investigacion",
            label: "lineas",
            role: ["SUPER", "EDITOR"]
        },
        {
            href: "/dashboard/usuarios",
            label: "usuarios",
            role: ["SUPER"]
        },
        {
            href: "/reportes",
            label: "Reportes",
            role: ["SUPER"]
        },
        {
            href: "/",
            label: "Salir",
            onClick: borrarToken,
            visible: isAuthenticated
        },

    ];

    return (
        <header className="header-container">
            <div className="desktop-header">
                <Title />
                <Nav menuItems={menuItems} userRole={rol} />
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
                            menuItems={menuItems} userRole={rol} 
                            onClick={() => { btnRemove(); toggleAside(); }}
                        />
                    </SideBar>
                </nav>
            </div>

        </header>
    );
};

export default Header;



