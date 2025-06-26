'use client'
import React from 'react'
import UsuarioTabla from '../../../components/usuarios'
import Layout from "../../../components/layout";
import "./index.css"

interface usuariosProps {

}

const usuarios: React.FC<usuariosProps> = () => {
    return (
        <Layout where='usuarios'>
            <UsuarioTabla />
        </Layout>

    );
}

export default usuarios;