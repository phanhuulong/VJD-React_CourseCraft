import { createContext, useEffect, useState } from "react";
import { getUser, User } from "../Api/User";
import React from "react";

interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export default function AppProvider({ children }: { children: React.ReactNode }) {

    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user,setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            if (!token) {
                setUser(null); 
                return;
            }
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        }
        fetchUser();
    }, [token]);

    return (
        <AppContext.Provider value={{ token, setToken, user, setUser}}>
            {children}
        </AppContext.Provider>
    )
}

//zustand, antd, react query ví dụ nội dung này typescript