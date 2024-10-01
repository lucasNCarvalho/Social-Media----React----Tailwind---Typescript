
import { api } from '@/lib/axios';
import { IContenxtType } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react'

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    // setUser: () => { },
    // setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
}


const AuthContext = createContext<IContenxtType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState(INITIAL_USER)
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            checkAuthUser()
        } else {
            setIsLoading(false);
            setIsAuthenticated(false)
        }
    }, []);

    async function checkAuthUser() {
        try {
            setIsLoading(true);

            const token = localStorage.getItem('token')
            if(!token) return false

            const {data} = await api.get('/get-profile')
            
            setUser(data.user);
            setIsAuthenticated(true);
            return true
         
        } catch (error) {

            setUser(INITIAL_USER)
            setIsAuthenticated(false);
            return false
        } finally {
            setIsLoading(false);
        }
    }   
    console.log('is', isAuthenticated)

    const value = {
        user,
        isLoading,
        isAuthenticated,
        checkAuthUser,
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUserContext = () => useContext(AuthContext);