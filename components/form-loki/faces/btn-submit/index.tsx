import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { URL_BACKEND } from "../../../../env"
import { notify } from "../../../nano"
import { isStrongPassword, isValidEmail } from "../../../../functions"
import { useAuth } from "../../../../context/AuthContext"
import "./_btnSubmitBasic.scss"

interface BtnSubmitBasicProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  disable?: boolean;
  formData: any;
  constext: string;
}

const BtnSubmitBasic = ({
  children,
  className = "",
  id = "",
  formData,
  constext,
}: BtnSubmitBasicProps) => {

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // Usar el contexto de autenticación

  let rebootToken: string | null;
  let response: any;
  let data: any;
  let endpoint: string;
  let requestBody: any;

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // En Next.js, verificamos si estamos en el cliente antes de acceder a localStorage
      rebootToken = typeof window !== 'undefined' 
        ? localStorage.getItem("reboot-token") 
        : null;

      data = {
        ...formData.data.current,
      };

      // Configurar endpoint y body según el contexto
      if (constext === "login" || constext === "/login") {
        endpoint = `${URL_BACKEND}/auth/login`;
        requestBody = {
          email: data.email?.toLowerCase(),
          password: data.password,
        };
      } else if (constext === "register") {
        endpoint = `${URL_BACKEND}/auth/register`;
        requestBody = {
          name: data.name,
          apellido: data.apellido,
          email: data.email?.toLowerCase(),
          password: data.password,
          confirmPassword: data.confirmPassword,
        };
      } else if (constext === "recover-password") {
        endpoint = `${URL_BACKEND}/auth/recover-password`;
        requestBody = {
          email: data.email?.toLowerCase(),
        };
      } else if (constext === "reboot-password") {
        endpoint = `${URL_BACKEND}/auth/reboot-password`;
        requestBody = {
          password: data.password,
          confirmPassword: data.confirmPassword,
          rebootToken
        };
      } else {
        // Fallback para GraphQL (contextos no REST)
        endpoint = `${URL_BACKEND}/graphql`;
        requestBody = {
          query: constext,
          variables: data,
          tokenCaptcha:  "",
          rebootToken: rebootToken || "",
        };
      }

      // Validaciones
      if (!data.email && constext !== "reboot-password") {
        notify({ type: "error", message: "El email es requerido" });
        return;
      }

      if (!data.password && constext !== "recover-password") {
        notify({ type: "error", message: "La contraseña es requerida" });
        return;
      }

      if (constext === "register" || constext === "reboot-password") {
        if (!data.confirmPassword) {
          notify({ type: "error", message: "La confirmación de la contraseña es requerida" });
          return;
        }

        if (data.password !== data.confirmPassword) {
          notify({ type: "error", message: "Las contraseñas no coinciden" });
          return;
        }

        if (!isStrongPassword(data.password)) {
          notify({ type: "warning", message: "La contraseña debe tener al menos 8 caracteres, incluir letras, números y al menos un símbolo" });
          return;
        }
      }

      if (constext === "register") {
        if (!isValidEmail(data.email)) {
          notify({ type: "error", message: "El email no es válido" });
          return;
        }

        if (!data.name) {
          notify({ type: "error", message: "El nombre es requerido" });
          return;
        }

        if (!data.apellido) {
          notify({ type: "error", message: "El apellido es requerido" });
          return;
        }
      }

      // Realizar la petición
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        notify({ 
          type: "error", 
          message: errorData.message || "Error al enviar la solicitud" 
        });
        return;
      }

      const responseData = await response.json();

      
      
      // Manejar respuesta según el contexto
      if (constext === "login" || constext === "/login") {
        if (responseData.type === "success") {
      
          // Usar el contexto de autenticación para el login

       
          login({ token: responseData.data.token });
          
       
          notify({ 
            type: "success", 
            message: responseData.message || "Login exitoso" 
          });
          
          // El contexto de autenticación ya maneja la navegación
        } else {
          notify({ 
            type: "error", 
            message: responseData.message || "Error en el login" 
          });
        }
      } else {

  
        // Para otros contextos (GraphQL o REST)
        const { data: datos, type, message, success } = responseData;

        notify({ 
          type: success ? "success" : (type || "error"), 
          message: message || "Operación completada" 
        });

        if (success || type === "success") {
          console.log(datos);
          router.push("/dashboard");
        }
      }

    } catch (error) {
      console.error("Error en las validaciones", error);
      notify({ type: "error", message: "Error inesperado" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`btn-submit-basic ${className}`} id={id}>
      <button
        disabled={loading}
        onClick={handleSubmit}
        type="button"
      >
        {loading ? "Cargando..." : children}
      </button>
    </div>
  );
};

export default BtnSubmitBasic;