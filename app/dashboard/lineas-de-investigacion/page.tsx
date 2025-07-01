'use client'
import React from 'react'
import LineasTabla from '../../../components/lineas-de-investigacion'
import Layout from "../../../components/layout";
import "./index.css"



const usuarios = () => {
    return (
        <Layout where='usuarios'>
            <LineasTabla />
        </Layout>

    );
}

export default usuarios;