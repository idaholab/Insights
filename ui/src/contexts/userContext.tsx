// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createContext, useContext, useState } from "react";
import { User } from "../types";

interface UserProviderProps {
    children: React.ReactNode;
}

interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>({ Id: '000', Role: 'SuperUser' });
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};