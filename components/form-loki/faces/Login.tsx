import React, { useRef, useState } from 'react'
import { BsFillEnvelopeHeartFill } from 'react-icons/bs';
import { MdLock } from "react-icons/md";

import { $ } from "../../../functions";
import { Input, BtnText, CheckBox } from "../../ux";
import BtnSubmitBasic from './btn-submit';
import HeadBtn from "./global/HeadBtn";


interface LoginProps {
    cardState: (css: string) => void;
    register: boolean;
    reset: boolean;
    social?: boolean;
}

const Login: React.FC<LoginProps> = ({ cardState, register, reset, social = false }) => {

    const inputRef = useRef({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        inputRef.current = { ...inputRef.current, [name]: value };
    };

    const [isChecked, setIsChecked] = useState(false);

 
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(inputRef.current);
    };

    const active = () => {
        $("btnBack")?.classList.add("active");

        const register = $("register");
        if (register) {
            register.style.display = "none";
        }

        const reset = $("reset");
        if (reset) {
            reset.style.display = "flex";
        }
    };

    return (
        <>
            <div className={`login front ${social ? "social" : ""}`} id="login">
                <HeadBtn cardState={cardState} register={register} />
                <form onSubmit={handleSubmit} >
                    <Input
                        type="email"
                        name="email"
                        id="emailLogin"
                        placeholder="Email"
                        icon={<BsFillEnvelopeHeartFill />}
                        onChange={handleChange}
                        iconFixed={true}
                    />

                    <Input
                        type="password"
                        name="password" // Cambiado de "passwordLogin" a "password"
                        placeholder={"Contraseña"}
                        icon={<MdLock />}
                        onChange={handleChange}
                        iconFixed={true}
                    />

                    <CheckBox
                        isChecked={isChecked}
                        onToggle={() => setIsChecked(!isChecked)}
                        label="Mantener sesión iniciada"
                    />

                 

                    <BtnSubmitBasic
                        formData={{
                            data: inputRef,
                            check: isChecked
                        }}
                        constext="login" // Cambiado de "/login" a "login" para consistencia
                    >
                        Iniciar sesión
                    </BtnSubmitBasic>

                    {reset && (
                        <BtnText onClick={() => {
                            active();
                            cardState("left-active");
                        }} >
                            ¿Olvidaste tu contraseña?
                        </BtnText>
                    )}

                </form>
            </div >
        </>
    );
}

export default Login;