'use client'
import React from 'react'
import Layout from "../components/layout";

import InteractiveSearchDashboard from "../components/view/home"


const home = () => {
    return (
        <Layout>
            <InteractiveSearchDashboard />
        </Layout>
    );
}

export default home;