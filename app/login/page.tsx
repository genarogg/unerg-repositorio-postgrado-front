'use client'
import React from 'react'
import FormLoki from "../../components/form-loki"
import Layout from "../../components/layout";
import "./login.css";

interface loginProps {

}

const login: React.FC<loginProps> = () => {
    return (
        <Layout where="login">
            <FormLoki />
        </Layout>
    );
}

export default login;