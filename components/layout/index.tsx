'use client';

import React from 'react'
import Header from "./header"

import "./sass/layout.scss"

import Spinner from '../ux/spinner/Spinner';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
    where?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    where = "",
    header,
    footer
}) => {

    const { state: { loading } } = useAuth();

    return (
        <div className={`containerAll clean ${where}`}>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {header ? header : <Header />}
                    <main>
                        {children}
                    </main>
         
         
                </>
            )}
        </div>
    );
}

export default Layout;