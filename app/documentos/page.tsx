'use client'
import React from 'react'
import Layout from "../../components/layout";

import Documentos from "../../components/view/documentos"
interface documentosProps {

}

const documentos: React.FC<documentosProps> = () => {
    return (
        <Layout>
            <Documentos />
        </Layout>
    );
}

export default documentos;