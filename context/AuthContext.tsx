'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { URL_BACKEND } from '../env';

// Tipos para el estado de autenticación
interface AuthState {
    token: string;
    loading: boolean;
    isAuthenticated: boolean;
}

// Tipos para las acciones del reducer
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { token: string } }
    | { type: 'LOGIN_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'VERIFY_TOKEN_SUCCESS' }
    | { type: 'VERIFY_TOKEN_FAILURE' };

// Función para verificar si localStorage está disponible
const isLocalStorageAvailable = (): boolean => {
    try {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch (error) {
        return false;
    }
};

// Función para obtener token desde localStorage
const getTokenFromStorage = (): string => {
    if (isLocalStorageAvailable()) {
        return localStorage.getItem('auth_token') || '';
    }
    return '';
};

// Función para guardar token en localStorage
const saveTokenToStorage = (token: string): void => {
    if (isLocalStorageAvailable()) {
        localStorage.setItem('auth_token', token);
    }
};

// Función para eliminar token de localStorage
const removeTokenFromStorage = (): void => {
    if (isLocalStorageAvailable()) {
        localStorage.removeItem('auth_token');
    }
};

// Hook personalizado para detectar rutas (reemplaza useRouteDetector)
const useRouteDetector = () => {
    const pathname = usePathname();

    const isCurrentRoute = (route: string): boolean => {
        return pathname === route;
    };

    return { isCurrentRoute, pathname };
};

// Estado inicial - obtiene el token desde localStorage si está disponible
const initialState: AuthState = {
    token: getTokenFromStorage(),
    loading: true,
    isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,
            };

        case 'LOGIN_SUCCESS':
            // Guardar token en localStorage
            saveTokenToStorage(action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                loading: false,
                isAuthenticated: true,
            };

        case 'LOGIN_FAILURE':
            // Eliminar token de localStorage en caso de fallo
            removeTokenFromStorage();
            return {
                ...state,
                token: '',
                loading: false,
                isAuthenticated: false,
            };

        case 'LOGOUT':
            // Eliminar token de localStorage al cerrar sesión
            removeTokenFromStorage();
            return {
                ...state,
                token: '',
                loading: false,
                isAuthenticated: false,
            };

        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };

        case 'VERIFY_TOKEN_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
            };

        case 'VERIFY_TOKEN_FAILURE':
            // Eliminar token de localStorage si la verificación falla
            removeTokenFromStorage();
            return {
                ...state,
                token: '',
                loading: false,
                isAuthenticated: false,
            };

        default:
            return state;
    }
};

// Contexto
interface AuthContextType {
    state: AuthState;
    login: (tokenData: { token: string }) => void;
    logout: () => void;
    verifyAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Provider del contexto
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const router = useRouter();
    const { isCurrentRoute } = useRouteDetector();

    // Función para iniciar sesión
    const login = (tokenData: { token: string }) => {
        try {

           
            dispatch({ type: 'LOGIN_START' });
            

            // El token se guarda automáticamente en localStorage a través del reducer
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token: tokenData.token }
            });

            console.log('Login exitoso');

            // Navegar al dashboard después del login exitoso
            router.push('/dashboard/trabajos');

        } catch (error) {
            console.error('Error en login:', error);
            dispatch({ type: 'LOGIN_FAILURE' });
            throw error;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        console.log('Sesión cerrada');

        // Navegar al inicio después de cerrar sesión
        router.push('/');
    };

    // Función para verificar si el usuario está autenticado
    const verifyAuth = async () => {
        try {
            // Obtener token desde localStorage (puede ser diferente del estado si se recargó la página)
            const storedToken = getTokenFromStorage();

            if (!storedToken) {
                dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
                return;
            }

            // Verificar el token con tu API - SOLO ENVIANDO EN EL BODY
            const response = await fetch(URL_BACKEND + "/auth/validar-sesion", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: storedToken }),
            });

            
            
            const responseData = await response.json();

            if (response.ok ) {
                // Si el token es válido y no está en el estado, actualizarlo
                if (!state.token) {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { token: storedToken }
                    });
                } else {
                    dispatch({ type: 'VERIFY_TOKEN_SUCCESS' });
                }
            } else {
                console.log('Token inválido:', responseData.message);
                dispatch({ type: 'VERIFY_TOKEN_FAILURE' });

                // Solo navegar si no estamos en una ruta pública
                if (!isCurrentRoute('/') && !isCurrentRoute('/login') && !isCurrentRoute('/register')) {
                    router.push('/');
                }
            }
        } catch (error) {
            console.error('Error verificando token:', error);
            dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
            
            // Solo navegar si no estamos en una ruta pública
            if (!isCurrentRoute('/') && !isCurrentRoute('/login') && !isCurrentRoute('/register')) {
                router.push('/');
            }
        }
    };

    // Verificar autenticación al cargar el componente
    useEffect(() => {
        verifyAuth();
    }, []);

    const value: AuthContextType = {
        state,
        login,
        logout,
        verifyAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;