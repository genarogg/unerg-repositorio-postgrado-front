import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

// Hook personalizado para detectar rutas en Next.js
const useRouteDetector = () => {
    const router = useRouter();
    const pathname = usePathname();

    const isCurrentRoute = (url: string): boolean => {
        return pathname === url;
    };

    // Versión más flexible que permite coincidencias parciales
    const isRouteMatch = (url: string, exact: boolean = true): boolean => {
        if (exact) {
            return pathname === url;
        }
        return pathname.startsWith(url);
    };

    // Función adicional para verificar rutas dinámicas
    const isDynamicRoute = (pattern: string): boolean => {
        // Convierte patrones como '/user/[id]' a regex
        const regexPattern = pattern.replace(/\[.*?\]/g, '[^/]+');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(pathname);
    };

    return {
        isCurrentRoute,
        isRouteMatch,
        isDynamicRoute,
        currentPath: pathname,
        router,
        query: router.query, // Parámetros de la URL
        asPath: router.asPath // Ruta completa incluyendo query strings
    };
};

export default useRouteDetector;