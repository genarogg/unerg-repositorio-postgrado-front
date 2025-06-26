import React from 'react';

const useIsLargeScreen = ({ dimension }: any) => {
    const [isLarge, setIsLarge] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            setIsLarge(window.innerWidth > dimension);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [dimension]);

    return isLarge;
}

export default useIsLargeScreen;