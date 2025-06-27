'use client'
import React, { useEffect } from "react";
import TableHeader from "./view/components/table-header";
import useConfigured from "./context/setConfigured";

import { useGlobalStatic } from "./context/Global";
import useData from "./context/data/useData";

import TableView from "./view/table-body/table-view";
import TableCardView from "./view/table-body/table-card";

import TablePagination from "./view/components/paginacion";

import useIsLargeScreen from "./view/hook/useIsLargeScreen"

const HolaMundo: React.FC = () => {

    const { setConfigured, configured, roles } = useGlobalStatic();

    const { initialData } = useData();

    useEffect(() => {
        initialData()

        const rolUser = configured.rolUser
        const config = useConfigured({ rolUser, roles });

        setConfigured(config);
    }, [configured.rolUser]);

    const isLargeScreen = useIsLargeScreen({ dimension: 768 });

    return (
        <div className="table-management-container">
            
            <TableHeader />

            {isLargeScreen ? <TableView /> : <TableCardView />}

            {/* <TableFooter /> */}
            <TablePagination />
        </div>
    );
}

export default HolaMundo;
