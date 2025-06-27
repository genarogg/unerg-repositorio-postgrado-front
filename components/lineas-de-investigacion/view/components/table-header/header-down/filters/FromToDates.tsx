'use client'
import React, { useState } from 'react'
import { useGlobalFilter } from '../../../../../context/Global'
import "./css/from-to-date.css"

interface FromToDateProps { }

const FromToDate: React.FC<FromToDateProps> = () => {
    // Obtener valores y funciones del store de filtros
    const { getDate, setDateStart, setDateEnd } = useGlobalFilter()
    const dateRange = getDate()

    const [fromInputType, setFromInputType] = useState<'text' | 'date'>('text')
    const [toInputType, setToInputType] = useState<'text' | 'date'>('text')

    const handleFromFocus = () => {
        setFromInputType('date')
    }

    const handleFromBlur = () => {
        if (!dateRange.start) {
            setFromInputType('text')
        }
    }

    const handleToFocus = () => {
        setToInputType('date')
    }

    const handleToBlur = () => {
        if (!dateRange.end) {
            setToInputType('text')
        }
    }

    const handleDateFromChange = (value: string) => {
        setDateStart(value || null)
    }

    const handleDateToChange = (value: string) => {
        setDateEnd(value || null)
    }

    return (
        <>
            <div className="date-filter-group">
                <input
                    id="fecha-desde"
                    type={fromInputType}
                    className="table-date-input"
                    value={dateRange.start || ''}
                    placeholder={fromInputType === 'text' ? 'Fecha desde' : ''}
                    onChange={(e) => handleDateFromChange(e.target.value)}
                    onFocus={handleFromFocus}
                    onBlur={handleFromBlur}
                />

                <input
                    id="fecha-hasta"
                    type={toInputType}
                    className="table-date-input"
                    value={dateRange.end || ''}
                    placeholder={toInputType === 'text' ? 'Fecha hasta' : ''}
                    onChange={(e) => handleDateToChange(e.target.value)}
                    onFocus={handleToFocus}
                    onBlur={handleToBlur}
                />
            </div>
        </>
    );
}

export default FromToDate;
