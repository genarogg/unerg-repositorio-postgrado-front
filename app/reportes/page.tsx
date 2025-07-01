'use client'
import React from 'react'
import Layout from "../../components/layout";
import Reportes from "../../components/reportes"

interface reportesProps {

}

const reportes: React.FC<reportesProps> = () => {
    return (
        <Layout>
            <Reportes />
        </Layout>
    );
}

export default reportes;