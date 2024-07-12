import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import nookies from 'nookies';
import { auth } from "../firebase/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser }) => {
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userx) => {
            if (!user && userx) {
                userx.getIdToken().then((token) => {
                    axios.post('/api/OAuth', { token })
                        .then((response) => {
                            setUser(response.data);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
            }
        });

        return () => unsubscribe();
    }, [user]);


    useEffect(() => {
        const cookies = nookies.get();
        if (cookies.api_key) {
            axios.get('/api/VerifyToken', { withCredentials: true })
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error(error);
                    setUser(null);
                });
        }
    }, []);

    const logout = async () => {
        try {
            // await auth.signOut(); fbase
            await axios.post('/api/Logout', {}, { withCredentials: true });
            await auth.signOut();
            nookies.destroy(null, 'api_key');
            setUser(null);
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);