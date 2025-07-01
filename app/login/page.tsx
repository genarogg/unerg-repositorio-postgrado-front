'use client'
import React from 'react'
import FormLoki from "../../components/form-loki"
import Layout from "../../components/layout";
import "./login.css";



const login = () => {
    return (
        <Layout where="login">
            <FormLoki />
        </Layout>
    );
}

export default login;