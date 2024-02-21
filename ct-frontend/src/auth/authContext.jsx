import { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import CapTapApi from '../../../api';
import * as jose from 'jose';


export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState();
    // const [currentUser, setCurrentUser] = useState(null);
    const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);
    const [token, setToken] = useLocalStorage("token", null);
    // const [token, setToken] = useState(() => {
    //         const storedToken = localStorage.getItem('token');
    //         return storedToken !== "undefined" ? storedToken : null;
    //     });

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                if (token !== null) {
                    CapTapApi.token = token;
                    const { username } = jose.decodeJwt(token);
                    console.log('ctapi token in authContext:', token);
                    const currentUser = await CapTapApi.getCurrentUser(username);
                    setCurrentUser(currentUser);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
                setCurrentUser(null);
                setIsLoggedIn(false);
            }
        }

        fetchCurrentUser();
    }, [token]);

    async function handleLogin(formData) {
        try {
            const logInResponse = await CapTapApi.login(formData)
            console.log("loginResponse handleLogin:", logInResponse);
            setToken(logInResponse);
            console.log("token after setToken handleLogin:", token);
            // localStorage.setItem('token', logInResponse.token);
            setIsLoggedIn(true);

            // Fetch user data and set currentUser state
            const { username } = jose.decodeJwt(token);
            console.log('username handleLogin:', username);
            const userData = await CapTapApi.getCurrentUser(username);
            console.log("userData handleLogin:", userData);
            setCurrentUser(userData);
            return { success: true };
        } catch (err) {
            console.log("login failed", err)
            return {success: false, error: err.message};
        }
    };

    async function handleSignup(formData) {
        try {
            const signUpResponse = await CapTapApi.signup(formData);
            setToken(signUpResponse);
            localStorage.setItem('token', signUpResponse);
            setIsLoggedIn(true);

            // Fetch user data and set currentUser state
            const { username } = jose.decodeJwt(token);
            console.log('username handleSignup:', username);
            const userData = await CapTapApi.getCurrentUser(username);
            setCurrentUser(userData);
            return { success: true };
        } catch (err) {
            console.error("signup failed", err);
            return { success: false, error: err.message };
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, currentUser, handleLogin, handleSignup, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;