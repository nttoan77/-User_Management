import { createContext, useContext } from 'react';

const ScrollContext = createContext(null);

export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScroll phải được dùng bên trong ScrollProvider');
    }
    return context;
};

export const ScrollProvider = ({ children, sectionRefs, scrollToSection }) => {
    return (
        <ScrollContext.Provider value={{ sectionRefs, scrollToSection }}>
            {children}
        </ScrollContext.Provider>
    );
};