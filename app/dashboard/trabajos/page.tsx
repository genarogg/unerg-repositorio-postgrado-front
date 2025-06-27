'use client'
import React from 'react'
import TrabajosTabla from '../../../components/trabajos'
import Layout from "../../../components/layout";
import "./index.css"

interface usuariosProps {

}

const usuarios: React.FC<usuariosProps> = () => {
    return (
        <Layout where='usuarios'>
            <TrabajosTabla />
        </Layout>

    );
}

export default usuarios;