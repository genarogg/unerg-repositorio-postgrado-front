import React, { useRef } from 'react'
import { BsFillEnvelopeHeartFill } from 'react-icons/bs';
import "./sass/_resetPassword.scss"

import { $ } from "../../../functions";
import { Input } from "../../ux";

import BtnSubmitBasic from './btn-submit';
import { BtnRowCircle } from "../../ux";


interface ResetPassWordProps {
    cardState: (css: string) => void;
}

const ResetPassWord: React.FC<ResetPassWordProps> = ({ cardState }) => {
    const inputRef = useRef({
        email: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        inputRef.current = { ...inputRef.current, [name]: value };
    };

    const active = () => {
        setTimeout(() => {
            $("btnBack")?.classList.remove("active");

            const register = $("register");

            if (register) {
                register.style.display = "flex";
            }

            const reset = $("reset");

            if (reset) {
                reset.style.display = "none";
            }
        }, 600);
    };

    return (
        <div className="reset left" id="reset">
            <div className="title">
                <BtnRowCircle id="btnBack" onClick={() => {
                    active();
                    cardState("front-active");
                }} />

                <p>Restablecer la contraseña</p>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <Input
                    type="email"
                    name="email"
                    id="emailReset"
                    placeholder="Email"
                    icon={<BsFillEnvelopeHeartFill />}
                    onChange={handleChange}
                />

                <BtnSubmitBasic
                    formData={{
                        data: inputRef.current
                    }}
                    constext="/recover-password"
                >
                    Recuperar cuenta
                </BtnSubmitBasic>

                <div className="text-recovery">
                    <span>
                        Ingrese el correo con el que se registro, Y se Te enviará un enlace con el que podrá restablecer su contraseña.
                    </span>
                </div>
            </form>
        </div>
    );
}

export default ResetPassWord;