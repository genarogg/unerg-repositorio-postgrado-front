'use client'
import React from 'react'
import Layout from "../components/layout";

import InteractiveSearchDashboard from "../components/view/home"
interface homeProps {

}

const home: React.FC<homeProps> = () => {
    return (
        <Layout>
            <InteractiveSearchDashboard />
        </Layout>
    );
}

export default home;