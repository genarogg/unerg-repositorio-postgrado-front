'use client'
import React from 'react'
import { A } from '../../nano'

interface TitleProps {

}

const Title: React.FC<TitleProps> = () => {
    const Separador = () => {
        return <span style={{ position: "relative", bottom: "1px" }}> | </span>
    }
    return (

        <div className="titulo">
            <A href="#" className="titulo-link">
                <h1>
                    <strong>
                        UNERG<Separador />POSTGRADO
                    </strong>
                </h1>
            </A>
        </div>


    );
}

export default Title;