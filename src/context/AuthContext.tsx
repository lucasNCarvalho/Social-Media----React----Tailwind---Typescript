
import { api } from '@/lib/axios';
import { useGetRecentPosts } from '@/lib/react-query/queryesAndMutations';
import { createContext, useContext, useEffect, useState } from 'react'

export const INITIAL_USER = {
    id: '',
    name: '',
    userName: '',
    email: '',
    imageUrl: '',
    bio: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0
}


const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: true, 
    isAuthenticated: false,
    checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 
   
    console.log(user)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuthUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    async function checkAuthUser() {
        try {
            setIsLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                return false;
            }

            const { data } = await api.get('/profile');
    
          
            setUser(data);
            setIsAuthenticated(true);
            return true;
         
        } catch (error) {
            setUser(INITIAL_USER);
            setIsAuthenticated(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    }   

    const value = {
        user,
        checkAuthUser,
        isLoading,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useUserContext = () => useContext(AuthContext);
