

const DEBUG = false

const PUBLIC_NEXT_ALGOLIA_ID = "L3RFZXXI90"
const PUBLIC_NEXT_ALGOLIA_KEY = "9ce899f55f87d9fe3938c8eb5f08b44c"

const BACKEND_DEV = "https://repositorio.unerg.tech"
const BACKEND_PROD = "https://repositorio.unerg.tech"

const FRONTEND_DEV = "http://localhost:3000"
const FRONTEND_PROD = "PROD"

/* GOOGLE */
const RECAPTCHA_KEY = "6LfVlLUqAAAAAHSxM5KYvmr--NOupZdKFu-JYIwf"

// saber si estoy en produccion
const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";

const URL_BACKEND = isProd ? BACKEND_PROD : BACKEND_DEV;
const URL_FRONTEND = isProd ? FRONTEND_PROD : FRONTEND_DEV;

export {
    isProd,
    DEBUG,
    PUBLIC_NEXT_ALGOLIA_ID as ALGOLIA_ID,
    PUBLIC_NEXT_ALGOLIA_KEY as ALGOLIA_KEY,
    URL_BACKEND,
    URL_FRONTEND,
    RECAPTCHA_KEY
};