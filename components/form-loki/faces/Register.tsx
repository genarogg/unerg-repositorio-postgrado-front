import React, { useRef } from 'react'
import { MdLock } from 'react-icons/md';
import { IoMdUnlock } from "react-icons/io";
import { BsFillEnvelopeHeartFill, BsPersonFill } from 'react-icons/bs';

import { Input } from "../../ux";
import BtnSubmitBasic from './btn-submit';

import HeadBtn from "./global/HeadBtn";
import RedesLogin from './global/RedesLogin';

interface RegisterProps {
    cardState: (css: string) => void;
    social?: boolean;
}

const Register: React.FC<RegisterProps> = ({ cardState, social = false }) => {
    const inputRef = useRef({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        inputRef.current = { ...inputRef.current, [name]: value };
    };

    return (

        <div className={`register right ${social ? "social" : ""}`} id="register">
            <HeadBtn cardState={cardState} register={true} />
            <form onSubmit={(e) => { e.preventDefault() }}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    icon={<BsPersonFill />}
                    onChange={handleChange}
                    iconFixed={true}
                />

                <Input
                    type="email"
                    name="email"
                    id='emailRegister'
                    placeholder="Email"
                    icon={<BsFillEnvelopeHeartFill />}
                    onChange={handleChange}
                    iconFixed={true}
                />

                <Input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    icon={<IoMdUnlock />}
                    onChange={handleChange}
                />

                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    icon={<MdLock />}
                    onChange={handleChange}
                />

                {social && <RedesLogin />}

                <BtnSubmitBasic
                    formData={{
                        data: inputRef,
                    }}
                    constext="/register"
                >
                    Registrarse
                </BtnSubmitBasic>

                <div className="text-recovery">
                    <span>
                        Al registrarte, aceptas nuestras Condiciones de uso y Política de privacidad.
                    </span>
                </div>
            </form>
        </div>
    );
}

export default Register;