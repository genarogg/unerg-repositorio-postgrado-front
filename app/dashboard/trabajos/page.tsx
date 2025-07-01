'use client'
import React from 'react'
import TrabajosTabla from '../../../components/trabajos'
import Layout from "../../../components/layout";
import "./index.css"



const usuarios = () => {
    return (
        <Layout where='usuarios'>
            <TrabajosTabla />
        </Layout>

    );
}

export default usuarios;