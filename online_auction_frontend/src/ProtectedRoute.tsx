import {Navigate} from 'react-router-dom';
import { ACCESS_TOKEN,REFRESH_TOKEN } from './Constants';
import jwtDecode from 'jwt-decode';
import { ReactNode } from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';


interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const refresh = async() =>{

        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try{
            const response = await axios.post('http://localhost:8000/auction/token/refresh/',{
                refresh: refreshToken
            });

            if (response.status === 200) {
                const { access } = response.data;
                localStorage.setItem(ACCESS_TOKEN, access);
                setIsAuthenticated(true);
                return true;
            }
            setIsAuthenticated(false);
            return false;
            

        }catch(error){

            console.error("Error refreshing token:", error);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            setIsAuthenticated(false);
            return;
        }

    };

    const auth = async() =>{

        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if(!accessToken && !refreshToken){
            setIsAuthenticated(false);
            return;
        }

        if(accessToken && refreshToken){
            interface DecodedToken {
                exp: number;
            }

            const decoded = jwtDecode<DecodedToken>(accessToken);
            const tokenExpiration = decoded.exp;
            const now  = Date.now() / 1000;

            if (tokenExpiration && tokenExpiration < now) {
                await refresh();
            } else if (tokenExpiration) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        }else{
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        auth();
    },[])

    if(isAuthenticated === null){
        return <div>Loading...</div>
    }

    return isAuthenticated ? <>{children}</> :<Navigate to = "/login" replace/>;

} 
export default ProtectedRoute;