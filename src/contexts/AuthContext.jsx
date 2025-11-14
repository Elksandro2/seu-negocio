import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    loading: true,
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkTokenValidity = (expirationTime) => {
        if (!expirationTime) return false;
        return Date.now() < parseInt(expirationTime, 10);
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedExpiration = localStorage.getItem('tokenExpiration');
        const storedUser = localStorage.getItem('user');

        if (storedToken && checkTokenValidity(storedExpiration)) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        } else {
            setToken(null);
            setUser(null);
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);

    const login = (token, expiresIn, userData) => {
        const expirationTimeMs = Date.now() + expiresIn * 1000;

        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', expirationTimeMs);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(token);
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            user,
            token,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}