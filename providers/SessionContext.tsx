'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface SessionContextType {
    session: any | null; // session이 없을 수 있으므로 null을 허용합니다.
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProviderWrapper = ({ session, children }: { session: any | null, children: React.ReactNode }) => {
    return (
        <SessionContext.Provider value={{ session }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSessionContext must be used within a SessionProviderWrapper');
    }
    return context;
};
